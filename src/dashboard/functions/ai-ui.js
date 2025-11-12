import { supabase } from '../../services/supabase.js'
import {
  applyOperations,
  askAssistant,
  ensureChat,
  getChatMessages,
  listChats,
  saveMessage,
} from './ai-assistant.js'

// Simple Markdown to HTML using a tiny fallback (no external lib). Allow basic formatting.
function md(text = '') {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>')
}

function el(html) {
  const d = document.createElement('div')
  d.innerHTML = html.trim()
  return d.firstElementChild
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user || null
}

// UI wiring
export async function initAIPage() {
  const user = await getCurrentUser()
  if (!user) {
    return // auth-handler handles redirect
  }

  const textarea = document.querySelector('#aiInput')
  const sendBtn = document.querySelector('#aiSend')
  const feed = document.querySelector('#aiFeed')
  const chatsList = document.querySelector('#aiChats')
  const newChatBtn = document.querySelector('#newChatBtn')

  let currentChatId = null

  async function loadChats() {
    const items = await listChats(user.id, 50)
    chatsList.innerHTML = ''
    for (const c of items) {
      const li = el(
        `<button class="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-sm" data-id="${
          c.id
        }">${c.title || 'Sem título'}</button>`
      )
      li.addEventListener('click', async () => {
        currentChatId = c.id
        await renderChat(c.id)
      })
      chatsList.appendChild(li)
    }
  }

  async function renderChat(chatId) {
    const msgs = await getChatMessages(chatId)
    feed.innerHTML = ''
    for (const m of msgs) {
      addMessage(m.role, m.content, m.parsed_json)
    }
  }

  function addMessage(role, content, parsed) {
    const who = role === 'user' ? 'Você' : 'Lumin'
    const bubbleCls =
      role === 'user'
        ? 'bg-white/5'
        : 'bg-lumi-400/10 border border-lumi-400/30'
    const item = el(
      `<div class="p-3 rounded-lg ${bubbleCls} text-sm mb-2"></div>`
    )
    item.innerHTML = `<div class="text-xs text-lumi-400 mb-1">${who}</div><div>${md(
      content
    )}</div>`
    feed.appendChild(item)

    if (
      role === 'assistant' &&
      parsed &&
      Array.isArray(parsed.buttons) &&
      parsed.buttons.length
    ) {
      const btnRow = el('<div class="flex flex-wrap gap-2 mt-2"></div>')
      parsed.buttons.forEach((b, _idx) => {
        const btn = el(
          `<button class="btn-ghost text-xs">${b.label || 'Ação'}</button>`
        )
        btn.addEventListener('click', async () => {
          await handleAssistantButton(b)
        })
        btnRow.appendChild(btn)
      })
      item.appendChild(btnRow)
    }
    feed.scrollTop = feed.scrollHeight
  }

  function handleAssistantButton(btn) {
    if (btn.action === 'open_calendar') {
      window.location.href = '../calendar/'
    } else if (btn.action === 'open_kanban') {
      window.location.href = '../'
    } else if (
      btn.action === 'apply_suggestion' ||
      btn.action === 'apply_operations'
    ) {
      if (btn.payload && Array.isArray(btn.payload.operations)) {
        addMessage(
          'assistant',
          'Apliquei as operações do botão. Quer revisar no Calendário ou Kanban?',
          null
        )
      } else {
        addMessage(
          'assistant',
          'Este botão não contém operações para aplicar.',
          null
        )
      }
    }
  }

  async function sendMessage() {
    const text = textarea.value.trim()
    if (!text) {
      return
    }
    // Create chat upfront with a provisional title derived from first message
    if (!currentChatId) {
      const title = text.length > 60 ? `${text.slice(0, 57)}...` : text
      currentChatId = await ensureChat(user.id, title || 'Conversa AI')
      await loadChats()
    }
    addMessage('user', text)
    textarea.value = ''
    await saveMessage({ chatId: currentChatId, role: 'user', content: text })

    try {
      const { parsed, fullText } = await askAssistant({
        userId: user.id,
        query: text,
        chatId: currentChatId,
      })
      const assistantText = parsed?.reply_markdown || fullText || ''
      addMessage('assistant', assistantText, parsed)
      await saveMessage({
        chatId: currentChatId,
        role: 'assistant',
        content: assistantText,
        parsed,
      })

      // Auto-apply only if mode=immediate
      if (
        parsed &&
        parsed.mode === 'immediate' &&
        Array.isArray(parsed.operations) &&
        parsed.operations.length
      ) {
        applyOperations(user.id, parsed.operations).catch(() => {
          addMessage(
            'assistant',
            'Desculpe, ocorreu um erro ao aplicar as operações.'
          )
        })
      }
    } catch (e) {
      addMessage(
        'assistant',
        'Desculpe, ocorreu um erro ao processar sua solicitação.'
      )
    }
  }

  // Wire events
  sendBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    sendMessage()
  })
  textarea?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      sendMessage()
    }
  })

  newChatBtn?.addEventListener('click', async () => {
    currentChatId = await ensureChat(user.id, 'Nova conversa')
    feed.innerHTML = ''
  })
}

// Auto-init if on page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () =>
    initAIPage().catch(console.error)
  )
} else {
  initAIPage().catch(console.error)
}
