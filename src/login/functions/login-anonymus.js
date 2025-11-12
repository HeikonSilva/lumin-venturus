import Swal from 'sweetalert2'
import { supabase } from '../../services/supabase.js'

const loginAnonymus = document.getElementById('login-guest')

if (loginAnonymus) {
  loginAnonymus.addEventListener('click', () => {
    // Supabase: Anônimo (previa/beta). Alternativa: Magic Link sem e-mail
    supabase.auth.signInAnonymously().then(({ error }) => {
      if (error) {
        Swal.fire({
          theme: 'auto',
          icon: 'error',
          title: 'Erro ao entrar como anônimo',
          text: error.message || error,
        })
        return
      }
      // auth-handler fará o redirect se sucesso
    })
  })
}
