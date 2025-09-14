import { supabase } from "../services/db.js";

function getBasePrefix() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  // Se hospedado em GitHub Pages (/<user>/<repo>/...), use "/<repo>" como base
  // Ajusta automaticamente quando servido em raiz (localhost ou domínio próprio)
  if (parts.length > 1 && /github\.io$/.test(window.location.host)) {
    return `/${parts[0]}`;
  }
  // Se o primeiro segmento parece ser o repo (e está presente em várias páginas), também trate como base
  // Heurística simples: se existir um index.html no nível acima, manter raiz
  return "";
}

const base = getBasePrefix();

function handleRoute(session) {
  const path = window.location.pathname;
  const isAuthed = !!session?.user;
  if (isAuthed) {
    if (
      path === `${base}/login/` ||
      path === `${base}/register/` ||
      path === `${base}/login` ||
      path === `${base}/register`
    ) {
      window.location.replace(`${base}/dashboard/`);
    }
  } else {
    if (path.startsWith("/dashboard")) {
      window.location.replace(`${base}/login/`);
    } else if (path.startsWith(`${base}/dashboard`)) {
      window.location.replace(`${base}/login/`);
    }
  }
}

// Checagem inicial
supabase.auth.getSession().then(({ data }) => handleRoute(data.session));

// Reagir a mudanças de autenticação
supabase.auth.onAuthStateChange((_event, session) => handleRoute(session));
