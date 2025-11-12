import { supabase } from '../../services/supabase.js'

// Tipos esperados de task:
// {
//   id: string (uuid),
//   user_id: string,
//   status: 'a-fazer' | 'em-progresso' | 'concluido',
//   priority: 'Alta' | 'Média' | 'Baixa',
//   type: string,
//   name: string,
//   description?: string,
//   start_date?: string (ISO),
//   end_date?: string (ISO),
//   created_at: string (ISO)
// }

// Cria uma nova task no Kanban (por usuário)
export async function createTask(userId, column, taskData) {
  const payload = {
    user_id: userId,
    status: column,
    priority: taskData.priority || 'Média',
    type: taskData.type || 'outro',
    name: taskData.name || taskData.title || 'Sem título',
    description: taskData.description || null,
    start_date: taskData.start_date || null,
    end_date: taskData.end_date || taskData.dueDate || null,
  }
  const { data, error } = await supabase
    .from('tasks')
    .insert(payload)
    .select('*')
    .single()
  if (error) {
    throw error
  }
  return data
}

// Obtém todas as tasks de uma coluna do Kanban (por usuário) com realtime
export function getTasks(userId, column, callback) {
  // Fetch inicial
  supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', column)
    .order('created_at', { ascending: true })
    .then(({ data, error }) => {
      if (!error && Array.isArray(data)) {
        callback(data)
      }
    })

  // Realtime por tabela filtrando por user_id
  const channel = supabase
    .channel(`tasks_${userId}_${column}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        // Refetch da coluna específica
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('status', column)
          .order('created_at', { ascending: true })
        if (!error && Array.isArray(data)) {
          callback(data)
        }
      }
    )
    .subscribe()

  // Retorna função para unsubscribe, caso necessário no futuro
  return () => {
    try {
      supabase.removeChannel(channel)
    } catch {}
  }
}

// Move task entre colunas
export async function moveTask(userId, _fromColumn, toColumn, task) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: toColumn })
    .eq('id', task.id)
    .eq('user_id', userId)
  if (error) {
    throw error
  }
}
