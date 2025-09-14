import { db } from "../../services/firebase.js";
import {
  ref,
  push,
  set,
  remove,
  onValue,
  get,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const userBase = (userId) => `users/${userId}/calendar/events`;

// Subscribe to all events for a user. Emits an array of { id, title, start, end, allDay, className?, description? }
export function listenEvents(userId, callback) {
  const eventsRef = ref(db, userBase(userId));
  return onValue(eventsRef, (snap) => {
    const data = snap.val() || {};
    const items = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    callback(items);
  });
}

// Fetch events once (no subscription)
export async function getEventsOnce(userId) {
  const eventsRef = ref(db, userBase(userId));
  const snap = await get(eventsRef);
  const data = snap.val() || {};
  return Object.entries(data).map(([id, value]) => ({ id, ...value }));
}

// Create a new event and return its key
export async function createEvent(userId, event) {
  const eventsRef = ref(db, userBase(userId));
  const res = await push(eventsRef, event);
  return res.key;
}

// Update existing event by id
export function updateEvent(userId, id, event) {
  const eventRef = ref(db, `${userBase(userId)}/${id}`);
  return set(eventRef, event);
}

// Delete event by id
export function deleteEvent(userId, id) {
  const eventRef = ref(db, `${userBase(userId)}/${id}`);
  return remove(eventRef);
}
