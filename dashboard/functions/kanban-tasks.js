import { db } from "../../services/firebase.js";
import {
  ref,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Caminho base por usuário
const userBase = (userId) => `users/${userId}/kanban`;

// Cria uma nova task no Kanban (por usuário)
export function createTask(userId, column, taskData) {
  const tasksRef = ref(db, `${userBase(userId)}/${column}`);
  return push(tasksRef, taskData);
}

// Obtém todas as tasks de uma coluna do Kanban (por usuário)
export function getTasks(userId, column, callback) {
  const tasksRef = ref(db, `${userBase(userId)}/${column}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(Object.entries(data).map(([id, value]) => ({ id, ...value })));
  });
}

// Move task entre colunas
export async function moveTask(userId, fromColumn, toColumn, task) {
  const fromRef = ref(db, `${userBase(userId)}/${fromColumn}/${task.id}`);
  const toRef = ref(db, `${userBase(userId)}/${toColumn}/${task.id}`);
  // Cria no destino e remove da origem (preserva id)
  await set(toRef, { ...task, status: toColumn });
  await remove(fromRef);
}
