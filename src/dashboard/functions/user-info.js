import { supabase } from '../../services/supabase.js'
import { setupLogout } from '../functions/logout.js'

export function mountUserInfo(containerId = 'userInfo') {
  const el = document.getElementById(containerId)
  if (!el) {
    return
  }

  function render(user) {
    if (!user) {
      el.innerHTML = ''
      return
    }
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      'Usuário'
    const avatar =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' +
        encodeURIComponent(name)

    el.innerHTML = `
      <div class="lumi-border p-3 flex items-center gap-3">
        <img src="${avatar}" alt="Avatar" class="w-8 h-8 rounded-full object-cover border border-white/10" />
        <div class="min-w-0">
          <p class="text-sm font-medium truncate">${name}</p>
          <p class="text-[11px] text-lumi-400 truncate">${user.email || ''}</p>
        </div>
        <button id="logoutBtn" class="ml-auto btn-ghost px-2 py-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg></button>
      </div>
    `
    setupLogout('logoutBtn')
  }

  // Initial and reactive
  supabase.auth
    .getSession()
    .then(({ data }) => render(data.session?.user || null))
  supabase.auth.onAuthStateChange((_event, session) =>
    render(session?.user || null)
  )
}
