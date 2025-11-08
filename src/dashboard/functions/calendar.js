// Initializes FullCalendar for the calendar page with consistent styling and behavior.
// This module mirrors the Kanban page’s structure and keeps calendar logic isolated.

/**
 * Initialize the calendar inside a given element.
 * - Adds basic sample events (placeholder)
 * - Configures localized strings and toolbar
 * - Enables selection and editing
 * @param {HTMLElement} el
 */
import { supabase } from '../../services/supabase.js'
import {
  createEvent,
  deleteEvent,
  getEventsOnce,
  listenEvents,
  updateEvent,
} from './calendar-events.js'

export function initCalendar(el) {
  if (!(window.FullCalendar && el)) {
    return
  }
  let calendar = null
  let currentUser = null
  let unsubscribe = null

  // Serialize a FC event to our RTDB shape
  function serializeEvent(ev) {
    const toIso = (d, allDay) => {
      if (!d) {
        return null
      }
      try {
        // For all-day, prefer date-only to avoid tz shifts; timestamptz accepts it
        return allDay
          ? new Date(d).toISOString().slice(0, 10)
          : new Date(d).toISOString()
      } catch {
        return null
      }
    }
    return {
      title: ev.title,
      start: toIso(ev.start, ev.allDay),
      end: toIso(ev.end, ev.allDay),
      allDay: ev.allDay,
    }
  }

  function initForUser(user) {
    currentUser = user

    // Tear down previous calendar instance if any
    if (calendar) {
      try {
        calendar.destroy()
      } catch {}
      calendar = null
    }
    if (typeof unsubscribe === 'function') {
      try {
        unsubscribe()
      } catch {}
      unsubscribe = null
    }

    if (!user) {
      return // auth-handler will redirect as needed
    }

    // 1) Fetch events once before rendering from Supabase tasks
    const fetchInitial = async () => await getEventsOnce(user.id)

    // Because we’re inside a non-async callback, use a helper
    fetchInitial().then((initialItems) => {
      // 2) Create calendar with initial events
      calendar = new FullCalendar.Calendar(el, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: { left: 'prev', center: 'title', right: 'next' },
        footerToolbar: false,
        titleFormat: { year: 'numeric', month: 'long' },
        buttonText: {
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        },
        height: 'auto',
        contentHeight: 600,
        aspectRatio: 1.8,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,

        eventClassNames(arg) {
          const p = arg.event.extendedProps?.priority
          const currentDate = new Date()
          const eDate = arg.event.end

          // console.log(currentDate > eDate)
          // console.log(eDate)

          if (currentDate > eDate) {
            return ['!bg-gray-500/10', '!border-gray-500/40', '!text-red-300']
          }
          if (p === 'Alta') {
            return ['!bg-red-500/10', '!border-red-500/40', '!text-red-300']
          }
          if (p === 'Média') {
            return [
              '!bg-orange-500/10',
              '!border-orange-500/40',
              '!text-orange-300',
            ]
          }
          if (p === 'Baixa') {
            return ['!bg-blue-500/10', '!border-blue-500/40', '!text-blue-300']
          }
          return []
        },

        events: initialItems,

        eventClick(info) {
          const ev = info.event
          const wantsDelete = confirm(
            `Excluir o evento "${ev.title}"? Esta ação não pode ser desfeita.`
          )
          if (wantsDelete && currentUser) {
            // Optimistic remove from UI
            ev.remove()
            deleteEvent(currentUser.id, ev.id).catch((err) => {
              console.error('Falha ao excluir evento:', err)
              alert('Não foi possível excluir o evento.')
              // Recarrega do backend para garantir consistência
              if (calendar && currentUser) {
                getEventsOnce(currentUser.id).then((items) => {
                  calendar.getEvents().forEach((e) => e.remove())
                  items.forEach((it) => calendar.addEvent(it))
                })
              }
            })
          }
        },
        async select(info) {
          if (!currentUser) {
            return calendar.unselect()
          }
          const title = prompt('Título do evento:')
          if (title) {
            const toIso = (d, allDay) => {
              if (!d) {
                return null
              }
              try {
                return allDay
                  ? new Date(d).toISOString().slice(0, 10)
                  : new Date(d).toISOString()
              } catch {
                return null
              }
            }
            const payload = {
              title,
              start: toIso(info.start, info.allDay),
              end: toIso(info.end, info.allDay),
              allDay: info.allDay,
            }
            try {
              const key = await createEvent(currentUser.id, payload)
              calendar.addEvent({ ...payload, id: key })
            } catch (err) {
              console.error('Falha ao criar evento:', err)
              alert('Não foi possível criar o evento.')
            }
          }
          calendar.unselect()
        },
        eventDrop(info) {
          const ev = info.event
          if (!currentUser) {
            return
          }
          const payload = serializeEvent(ev)
          // Optimistic: já está refletido na UI; só confirma no backend
          updateEvent(currentUser.id, ev.id, payload).catch((err) => {
            console.error('Falha ao atualizar evento:', err)
            alert('Não foi possível atualizar o evento.')
            // Em caso de erro, refetch para corrigir posição
            if (calendar && currentUser) {
              getEventsOnce(currentUser.id).then((items) => {
                calendar.getEvents().forEach((e) => e.remove())
                items.forEach((it) => calendar.addEvent(it))
              })
            }
          })
        },
        eventResize(info) {
          const ev = info.event
          if (!currentUser) {
            return
          }
          const payload = serializeEvent(ev)
          updateEvent(currentUser.id, ev.id, payload).catch((err) => {
            console.error('Falha ao redimensionar evento:', err)
            alert('Não foi possível redimensionar o evento.')
            if (calendar && currentUser) {
              getEventsOnce(currentUser.id).then((items) => {
                calendar.getEvents().forEach((e) => e.remove())
                items.forEach((it) => calendar.addEvent(it))
              })
            }
          })
        },
      })

      calendar.render()

      // 3) Live updates: subscribe and reconcile (naive clear & add)
      unsubscribe = listenEvents(user.id, (items) => {
        if (!calendar) {
          return
        }
        calendar.getEvents().forEach((e) => e.remove())
        for (const it of items) {
          calendar.addEvent(it)
        }
      })
    })
  }

  // Sessão inicial
  supabase.auth.getSession().then(({ data }) => {
    const user = data.session?.user || null
    initForUser(user)
  })
  // Mudanças futuras
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user || null
    initForUser(user)
  })
}
