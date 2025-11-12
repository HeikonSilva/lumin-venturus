import { ai } from '../../services/google-ai-studio.js'
import { supabase } from '../../services/supabase.js'
import { createEvent, deleteEvent, updateEvent } from './calendar-events.js'
import { createTask, moveTask } from './kanban-tasks.js'

// Contract: we ask the model to return a fenced JSON with operations and optional buttons
// Shape:
// {
//   "reply_markdown": string,
//   "mode": "immediate" | "buttons" | "none",
//   "operations": [
//      { "type": "create_task", "data": {name, description, priority, status, type, start_date, end_date} },
//      { "type": "update_task", "id": string, "data": { ...partial task fields } },
//      { "type": "move_task", "id": string, "to": "a-fazer|em-progresso|concluido" },
//      { "type": "delete_task", "id": string },
//      { "type": "create_event", "data": {title, start, end, allDay} },
//      { "type": "update_event", "id": string, "data": {start?, end?} },
//      { "type": "delete_event", "id": string }
//   ],
//   "buttons": [ { "label": string, "action": "apply_suggestion|open_calendar|open_kanban|none", "payload"?: any } ]
// }

const ASSISTANT_SYSTEM = `Você é a Lumin, assistente especializada em gestão de tarefas e estudos.

O que você pode fazer:
- Repriorizar tarefas (mudar status e prioridade), sugerir datas, criar eventos no calendário, quebrar tarefas grandes, criar e apagar tarefas/eventos, e criar planos de estudo por dia.
- Responder perguntas sobre organização, priorização por prazo/impacto, e cronogramas.

Contrato de resposta (OBRIGATÓRIO):
- Sempre retorne um bloco JSON VÁLIDO dentro de três crases (\`\`\`json ... \`\`\`), contendo ao menos "reply_markdown".
- Campo "mode": "immediate" | "buttons" | "none".
  - immediate: as operações em "operations" serão aplicadas automaticamente.
  - buttons: NÃO inclua operações em "operations". Em vez disso, inclua-as no campo "payload.operations" de um botão com action "apply_suggestion" ou "apply_operations". Elas só serão aplicadas quando o usuário clicar.
  - none: somente aconselhamento. NÃO inclua "operations" nem "buttons" com operações. Use quando o usuário pedir apenas uma sugestão/opinião, como "qual o melhor dia para...".
- Campo "reply_markdown": um resumo curto (<= 500 caracteres) e objetivo. Deixe claro se as ações já foram aplicadas (immediate), se estão nos botões (buttons) ou se é apenas orientação (none).
- Campo "operations": lista de ações (somente se mode=immediate).
- Campo "buttons": até 3 ações de interface. Se mode=buttons, pelo menos um botão deve conter "payload.operations".

Tipos de operações suportadas:
- create_task: cria uma nova tarefa COMPLETA com todos os campos obrigatórios.
- update_task: atualiza campos de uma tarefa existente (use o id do contexto).
- move_task: muda o status da tarefa para a-fazer | em-progresso | concluido.
- delete_task: remove uma tarefa existente (use o id do contexto).
- create_event: cria evento no calendário com title, start, end, allDay.
- update_event: atualiza datas de um evento existente.
- delete_event: remove um evento existente.

Regras ao manipular tarefas:
- NUNCA invente IDs; para atualizar/mover/apagar use os IDs do contexto.
- Se o usuário citar novas tarefas que NÃO existem no contexto (sem id), CRIE-AS primeiro (create_task) — uma por item citado, sem omitir nenhuma.
- Ao criar tarefa (create_task), preencha TODOS os campos de uma task: { name, description, priority (Alta|Média|Baixa), status (a-fazer|em-progresso|concluido), type, start_date (YYYY-MM-DD ou null), end_date (YYYY-MM-DD) }
  - Se não houver data de início, use null.
  - Garanta coerência entre prioridade, status e prazos.
- Ao criar eventos (create_event), use { title, start, end, allDay } com datas ISO. Um plano de estudos deve gerar um evento por dia sugerido.
- Não declare que priorizou/atualizou algo que ainda não existe; se necessário, crie primeiro e só então atualize/mover.

Planos/Guias de estudo (OBRIGATÓRIO):
- Se o pedido mencionar guia/plano/cronograma de estudos, cada tarefa criada DEVE ter uma descrição detalhada (1–3 frases) explicando objetivo, tópicos a cobrir e orientação prática (ex.: tempo sugerido, materiais, próximos passos).

Contexto de conversa:
- Você receberá um "Histórico do chat (recente)". Considere esse histórico para manter a continuidade, evitar repetição e entender pedidos anteriores.

Exemplo (mode=buttons):
\`\`\`json
{
  "mode": "buttons",
  "reply_markdown": "Plano de estudos pronto. Clique em 'Adicionar ao Calendário' para criar os eventos.",
  "buttons": [
    {
      "label": "Adicionar ao Calendário",
      "action": "apply_operations",
      "payload": {
        "operations": [
          { "type": "create_event", "data": { "title": "Estudar Álgebra", "start": "2025-09-15", "end": "2025-09-15", "allDay": true } },
          { "type": "create_event", "data": { "title": "Estudar Geometria", "start": "2025-09-16", "end": "2025-09-16", "allDay": true } }
        ]
      }
    }
  ]
}
\`\`\`

Exemplo (mode=immediate):
\`\`\`json
{
  "mode": "immediate",
  "reply_markdown": "Reorganizei suas tarefas por prioridade e prazos (aplicado).",
  "operations": [
    { "type": "move_task", "id": "<TASK_ID>", "to": "em-progresso" },
    { "type": "update_task", "id": "<TASK_ID2>", "data": { "priority": "Alta", "end_date": "2025-09-20" } }
  ]
}
\`\`\`
`

export async function loadUserContext(userId) {
  // Load tasks
  const { data: tasks, error: tasksErr } = await supabase
    .from('tasks')
    .select(
      'id,name,description,priority,status,type,start_date,end_date,created_at'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (tasksErr) {
    throw tasksErr
  }

  // Optionally, recent chats for context
  const { data: chats } = await supabase
    .from('ai_chats')
    .select('id, title, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(5)

  return { tasks: tasks || [], recentChats: chats || [] }
}

function formatHistory(messages = [], maxMessages = 12, maxChars = 4000) {
  const latest = messages.slice(-maxMessages)
  const lines = latest.map((m) => {
    const who = m.role === 'user' ? 'Usuário' : 'Lumin'
    return `${who}: ${m.content || ''}`
  })
  let text = lines.join('\n')
  if (text.length > maxChars) {
    text = text.slice(text.length - maxChars)
  }
  return text
}

function buildPrompt({ userQuery, userId, tasks, historyText }) {
  const now = new Date().toISOString()
  const tasksContext = tasks
    .map(
      (t) =>
        `- [${t.id}] ${t.name} | prioridade: ${t.priority} | status: ${
          t.status
        } | tipo: ${t.type} | início: ${t.start_date || '-'} | fim: ${
          t.end_date || '-'
        }`
    )
    .join('\n')

  const instruction = `${ASSISTANT_SYSTEM}
Contexto atual:
Data/hora: ${now}
Usuário: ${userId}
Tarefas:
${tasksContext || '(sem tarefas)'}

Histórico do chat (recente):
${historyText || '(vazio)'}

Pedido do usuário:
"""
${userQuery}
"""

Responda com um bloco Markdown curto (reply_markdown) e, se houver ações, um bloco JSON válido, FENCED com três crases. Exemplo:
\n\n\`\`\`json\n{"reply_markdown":"...","operations":[...],"buttons":[...]}\n\`\`\`\n`
  return instruction
}

export async function askAssistant({ userId, query, chatId }) {
  const ctx = await loadUserContext(userId)
  let historyText = ''
  if (chatId) {
    try {
      const history = await getChatMessages(chatId)
      historyText = formatHistory(history)
    } catch {
      // ignore errors
    }
  }
  const prompt = buildPrompt({
    userQuery: query,
    userId,
    tasks: ctx.tasks,
    historyText,
  })

  // Send prompt to Gemini and stream or single-shot
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  // Extract text from response structure
  let fullText = ''
  try {
    // Try the .text() method first
    if (typeof response.text === 'function') {
      fullText = response.text()
    } else {
      // Fallback: extract from response structure
      fullText = response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }
  } catch {
    // If all else fails, try direct access
    fullText = response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  const parsed = parseFencedJSON(fullText)
  return { ctx, fullText, parsed }
}

export function parseFencedJSON(text) {
  if (!text) {
    return null
  }
  const fenceRe = /```json\n([\s\S]*?)```/i
  const m = text.match(fenceRe)
  if (!m) {
    return null
  }
  try {
    return JSON.parse(m[1])
  } catch (e) {
    return null
  }
}

// Apply operations from assistant
export async function applyOperations(userId, operations = []) {
  const results = []
  for (const op of operations) {
    try {
      switch (op.type) {
        case 'delete_task': {
          if (!op.id) {
            throw new Error('delete_task requer id')
          }
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', op.id)
            .eq('user_id', userId)
          if (error) {
            throw error
          }
          results.push({ ok: true, type: op.type, id: op.id })
          break
        }
        case 'create_task': {
          // Fallback: garantir descrição detalhada para guias/planos de estudo
          const data = { ...(op.data || {}) }
          const textForCheck = `${data.name || data.title || ''} ${
            data.description || ''
          }`
          const isStudyPlan = /plano|cronograma|guia|estudo/i.test(textForCheck)
          if (isStudyPlan && !data.description) {
            data.description =
              'Plano de estudo: explique objetivos, tópicos a cobrir, tempo sugerido e próximos passos. Ajuste conforme necessidade.'
          }
          const created = await createTask(
            userId,
            data?.status || 'a-fazer',
            data
          )
          results.push({ ok: true, type: op.type, id: created.id })
          break
        }
        case 'update_task': {
          if (!op.id) {
            throw new Error('update_task requer id')
          }
          const { error } = await supabase
            .from('tasks')
            .update(op.data || {})
            .eq('id', op.id)
            .eq('user_id', userId)
          if (error) {
            throw error
          }
          results.push({ ok: true, type: op.type, id: op.id })
          break
        }
        case 'move_task': {
          if (!(op.id && op.to)) {
            throw new Error('move_task requer id e to')
          }
          await moveTask(userId, null, op.to, { id: op.id })
          results.push({ ok: true, type: op.type, id: op.id })
          break
        }
        case 'create_event': {
          const key = await createEvent(userId, op.data || {})
          results.push({ ok: true, type: op.type, id: key })
          break
        }
        case 'update_event': {
          if (!op.id) {
            throw new Error('update_event requer id')
          }
          await updateEvent(userId, op.id, op.data || {})
          results.push({ ok: true, type: op.type, id: op.id })
          break
        }
        case 'delete_event': {
          if (!op.id) {
            throw new Error('delete_event requer id')
          }
          await deleteEvent(userId, op.id)
          results.push({ ok: true, type: op.type, id: op.id })
          break
        }
        default:
          results.push({
            ok: false,
            type: op.type,
            error: 'Tipo não suportado',
          })
      }
    } catch (e) {
      results.push({ ok: false, type: op.type, error: e.message })
    }
  }
  return results
}

// Chat persistence
export async function ensureChat(userId, title = 'Nova conversa') {
  // Create a chat row
  const { data, error } = await supabase
    .from('ai_chats')
    .insert({ user_id: userId, title })
    .select('id')
    .single()
  if (error) {
    throw error
  }
  return data.id
}

export async function listChats(userId, limit = 20) {
  const { data, error } = await supabase
    .from('ai_chats')
    .select('id, title, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (error) {
    throw error
  }
  return data || []
}

export async function saveMessage({ chatId, role, content, parsed }) {
  const { error } = await supabase.from('ai_messages').insert({
    chat_id: chatId,
    role,
    content,
    parsed_json: parsed ? parsed : null,
  })
  if (error) {
    throw error
  }
  // bump chat updated_at
  await supabase
    .from('ai_chats')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', chatId)
}

export async function getChatMessages(chatId) {
  const { data, error } = await supabase
    .from('ai_messages')
    .select('id, role, content, parsed_json, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  if (error) {
    throw error
  }
  return data || []
}
