// Initializes FullCalendar for the calendar page with consistent styling and behavior.
// This module mirrors the Kanban page’s structure and keeps calendar logic isolated.

/**
 * Initialize the calendar inside a given element.
 * - Adds basic sample events (placeholder)
 * - Configures localized strings and toolbar
 * - Enables selection and editing
 * @param {HTMLElement} el
 */
import { auth } from "../../services/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  listenEvents,
  getEventsOnce,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./calendar-events.js";

export function initCalendar(el) {
  if (!window.FullCalendar || !el) return;
  let calendar = null;
  let currentUser = null;
  let unsubscribe = null;

  // Serialize a FC event to our RTDB shape
  function serializeEvent(ev) {
    return {
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr,
      allDay: ev.allDay,
      ...(ev.extendedProps?.className
        ? { className: ev.extendedProps.className }
        : {}),
      ...(ev.extendedProps?.description
        ? { description: ev.extendedProps.description }
        : {}),
    };
  }

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    // Tear down previous calendar instance if any
    if (calendar) {
      try {
        calendar.destroy();
      } catch {}
      calendar = null;
    }
    if (typeof unsubscribe === "function") {
      try {
        unsubscribe();
      } catch {}
      unsubscribe = null;
    }

    if (!user) return; // auth-handler will redirect as needed

    // 1) Fetch events once before rendering
    const initialItems = await getEventsOnce(user.uid);

    // 2) Create calendar with initial events
    calendar = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "pt-br",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia",
      },
      height: "auto",
      contentHeight: 600,
      aspectRatio: 1.8,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,

      events: initialItems.map((it) => ({
        id: it.id,
        title: it.title,
        start: it.start,
        end: it.end || null,
        allDay: !!it.allDay,
        extendedProps: { rid: it.id },
      })),

      eventClick: function (info) {
        const ev = info.event;
        const wantsDelete = confirm(
          `Excluir o evento "${ev.title}"? Esta ação não pode ser desfeita.`
        );
        if (wantsDelete && currentUser && ev.extendedProps.rid) {
          deleteEvent(currentUser.uid, ev.extendedProps.rid);
        }
      },
      select: async function (info) {
        if (!currentUser) return calendar.unselect();
        const title = prompt("Título do evento:");
        if (title) {
          const payload = {
            title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay,
          };
          const key = await createEvent(currentUser.uid, payload);
          calendar.addEvent({
            ...payload,
            id: key,
            extendedProps: { rid: key },
          });
        }
        calendar.unselect();
      },
      eventDrop: function (info) {
        const ev = info.event;
        if (!currentUser || !ev.extendedProps.rid) return;
        const payload = serializeEvent(ev);
        updateEvent(currentUser.uid, ev.extendedProps.rid, payload);
      },
      eventResize: function (info) {
        const ev = info.event;
        if (!currentUser || !ev.extendedProps.rid) return;
        const payload = serializeEvent(ev);
        updateEvent(currentUser.uid, ev.extendedProps.rid, payload);
      },
    });

    calendar.render();

    // 3) Live updates: subscribe and reconcile (naive clear & add)
    unsubscribe = listenEvents(user.uid, (items) => {
      if (!calendar) return;
      calendar.getEvents().forEach((e) => e.remove());
      for (const it of items) {
        calendar.addEvent({
          id: it.id,
          title: it.title,
          start: it.start,
          end: it.end || null,
          allDay: !!it.allDay,
          extendedProps: { rid: it.id },
        });
      }
    });
  });
}
