import Swal from 'sweetalert2'
import { supabase } from '../../services/supabase.js'

const form = document.registerForm
const signupPanel = document.getElementById('signup-panel')
const verifyPanel = document.getElementById('verify-panel')
const verifyEmailEl = document.getElementById('verify-email')
const resendBtn = document.getElementById('resend-email')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const email = form.email.value
  const password = form.password.value

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // opcional: defina uma URL de redirecionamento de confirmação se necessário
    options: { emailRedirectTo: `${location.origin}/dashboard/` },
  })

  if (error) {
    Swal.fire({
      theme: 'auto',
      icon: 'error',
      title: 'Erro ao cadastrar',
      text: error.message || error,
    })
    return
  }

  // Em projetos com confirmação por e-mail habilitada, data.session pode ser null
  if (data?.user) {
    // Atualiza UI: esconde formulário e mostra instruções de verificação
    try {
      if (verifyEmailEl) {
        verifyEmailEl.textContent = email
      }
      if (signupPanel) {
        signupPanel.classList.add('hidden')
      }
      if (verifyPanel) {
        verifyPanel.classList.remove('hidden')
      }
    } catch {
      // ignorar erros de UI
    }

    // Caso a sessão já exista (p.ex. confirmação desabilitada), redireciona
    if (data.session) {
      window.location.replace('/dashboard/')
    }
  }
})

// Reenviar e-mail de confirmação
resendBtn?.addEventListener('click', async () => {
  const email = form?.email?.value || verifyEmailEl?.textContent
  if (!email) {
    return
  }
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })
  if (error) {
    Swal.fire({
      theme: 'auto',
      icon: 'error',
      title: 'Erro ao reenviar',
      text: error.message || error,
    })
  } else {
    Swal.fire({
      theme: 'auto',
      icon: 'success',
      title: 'E‑mail reenviado',
      text: 'Verifique sua caixa de entrada (e o spam).',
    })
  }
})
