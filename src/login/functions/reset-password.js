import { supabase } from '../../services/supabase.js'

function getBasePrefix() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts.length > 1 && /github\.io$/.test(window.location.host)) {
    return `/${parts[0]}`
  }
  return ''
}

export function setupResetPassword({
  linkId = 'forgotPwd',
  emailInputId = 'email',
  feedbackId = 'resetFeedback',
} = {}) {
  const link = document.getElementById(linkId)
  const emailInput = document.getElementById(emailInputId)
  let feedback = document.getElementById(feedbackId)

  if (!(link && emailInput)) {
    return
  }
  if (!feedback) {
    feedback = document.createElement('div')
    feedback.id = feedbackId
    feedback.className = 'mt-3 text-sm'
    link.parentElement?.appendChild(feedback)
  }

  link.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = emailInput.value?.trim()
    if (!email) {
      feedback.textContent = 'Informe seu e-mail primeiro.'
      feedback.className = 'mt-3 text-sm text-red-500'
      return
    }
    link.setAttribute('disabled', 'true')
    try {
      const base = getBasePrefix()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${base}/login/`,
      })
      if (error) {
        throw error
      }
      feedback.textContent = 'Enviamos um link de redefinição para seu e-mail.'
      feedback.className = 'mt-3 text-sm text-green-500'
    } catch (err) {
      console.error(err)
      feedback.textContent = 'Não foi possível enviar o e-mail de redefinição.'
      feedback.className = 'mt-3 text-sm text-red-500'
    } finally {
      link.removeAttribute('disabled')
    }
  })
}
