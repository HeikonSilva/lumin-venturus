import { supabase } from '../../services/supabase.js'

export function setupLogout(buttonId = 'logoutBtn') {
  const btn = document.getElementById(buttonId)
  if (!btn) {
    return
  }
  btn.addEventListener('click', async () => {
    btn.disabled = true
    try {
      await supabase.auth.signOut()
      // auth-handler will redirect if necessary, but force navigate for safety
      const base = `${import.meta.env.BASE_URL}`
      window.location.replace(`${base}login/`)
    } catch (err) {
      console.error('Falha ao sair:', err)
      alert('Não foi possível finalizar a sessão agora.')
    } finally {
      btn.disabled = false
    }
  })
}
