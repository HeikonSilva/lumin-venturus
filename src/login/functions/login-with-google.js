import { supabase } from '../../services/supabase.js'

const loginWithGoogle = document.getElementById('login-google')

if (loginWithGoogle) {
  loginWithGoogle.addEventListener('click', () => {
    // Para apps estáticos, use redirecionamento OAuth
    const redirectTo = new URL('../dashboard/', location.href).href
    supabase.auth
      .signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          alert(`Erro ao entrar com Google: ${error.message}`)
        }
      })
  })
}
