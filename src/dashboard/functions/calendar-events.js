import { supabase } from '../../services/supabase.js'

// Converte qualquer valor para "YYYY-MM-DD" (sem horário/UTC)
function dateOnly(v) {
  if (!v) {
    return null
  }
  const s = typeof v === 'string' ? v : new Date(v).toISOString()
  return s.slice(0, 10)
}

// Calendar view works directly on the tasks table, interpreting end_date as the deadline.
// Map task -> calendar event shape
function toEvent(task) {
  const startRaw = task.start_date || task.end_date || null
  const endRaw = task.end_date || null
  const start = dateOnly(startRaw)
  const end = endRaw ? dateOnly(endRaw) : null
  // Para all-day de um único dia, não enviar "end" para evitar ambiguidades
  const endForFc = end && end !== start ? end : null

  return {
    id: task.id,
    title: task.name,
    start,
    end: endForFc,
    allDay: true,
    extendedProps: {
      rid: task.id,
      priority: task.priority,
      status: task.status,
      type: task.type,
      description: task.description || '',
    },
  }
}

export async function getEventsOnce(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map(toEvent)
}

export function listenEvents(userId, callback) {
  // initial fetch
  getEventsOnce(userId).then((items) => callback(items))

  const channel = supabase
    .channel(`tasks_calendar_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        const items = await getEventsOnce(userId)
        callback(items)
      }
    )
    .subscribe()

  return () => {
    try {
      supabase.removeChannel(channel)
    } catch {}
  }
}

export async function createEvent(userId, event) {
  // Create task from calendar (default status a-fazer, priority Média)
  const norm = (v) => (v === '' || v === undefined ? null : v)
  const allDay = event?.allDay !== false // default true
  const startNorm = norm(event.start)
  const endNorm = norm(event.end) || startNorm

  const payload = {
    user_id: userId,
    status: 'a-fazer',
    priority: 'Média',
    type: 'calendario',
    name: event.title,
    description: '',
    start_date: allDay ? dateOnly(startNorm) : startNorm,
    end_date: allDay ? dateOnly(endNorm) : endNorm,
  }
  const { data, error } = await supabase
    .from('tasks')
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function updateEvent(userId, id, event) {
  const norm = (v) => (v === '' || v === undefined ? null : v)
  const allDay = event?.allDay !== false // default true
  const startNorm = norm(event.start)
  const endNorm = norm(event.end)

  const { error } = await supabase
    .from('tasks')
    .update({
      start_date: allDay ? dateOnly(startNorm) : startNorm,
      end_date: allDay ? dateOnly(endNorm) : endNorm,
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteEvent(userId, id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}
