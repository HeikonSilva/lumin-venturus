import { supabase } from '../services/supabase.js'

const base = `${import.meta.env.BASE_URL}`

function handleRoute(session) {
  const path = window.location.pathname
  const isAuthed = !!session?.user
  if (isAuthed) {
    if (
      path === `${base}login/` ||
      path === `${base}register/` ||
      path === `${base}login` ||
      path === `${base}register`
    ) {
      window.location.replace(`${base}dashboard/`)
    }
  } else if (path.startsWith('/dashboard')) {
    window.location.replace(`${base}login/`)
  } else if (path.startsWith(`${base}/dashboard`)) {
    window.location.replace(`${base}login/`)
  }
}

// Checagem inicial
supabase.auth.getSession().then(({ data }) => handleRoute(data.session))

// Reagir a mudanças de autenticação
supabase.auth.onAuthStateChange((_event, session) => handleRoute(session))
