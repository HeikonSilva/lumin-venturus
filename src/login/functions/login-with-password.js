import Swal from 'sweetalert2'
import { supabase } from '../../services/supabase.js'

const form = document.loginForm
const errorLabel = document.getElementById('loginError')

// Supabase auth state listener
const { data: sub } = supabase.auth.onAuthStateChange((event, _session) => {
  if (event === 'SIGNED_IN' && errorLabel) {
    // clear any previous error message when user signs in
    errorLabel.textContent = ''
    errorLabel.classList.add('hidden')
  }
})

// Clean up listener on page unload
window.addEventListener('beforeunload', () => {
  try {
    sub?.subscription?.unsubscribe?.()
  } catch {
    // ignore errors
  }
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = form.email.value
  const password = form.password.value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (errorLabel) {
      errorLabel.textContent =
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : `Falha no login: ${error.message}`
      errorLabel.classList.remove('hidden')
    } else {
      Swal.fire({
        theme: 'auto',
        icon: 'error',
        title: 'Falha no login',
        text: `Falha no login: ${error.message}`,
      })
    }
    return
  }

  if (data?.session) {
    // auth-handler cuidará do redirect
  }
})

// Hide error message as user types again
for (const name of ['email', 'password']) {
  const input = form?.[name]
  input?.addEventListener('input', () => {
    if (errorLabel && !errorLabel.classList.contains('hidden')) {
      errorLabel.textContent = ''
      errorLabel.classList.add('hidden')
    }
  })
}
