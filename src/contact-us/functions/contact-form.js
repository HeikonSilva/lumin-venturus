import { init, send } from '@emailjs/browser'

init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY })

function sendContactEmail(name, message, email) {
  const templateParams = {
    name,
    email,
    message,
    time: new Date().toISOString(),
  }
  return send('service_useuat9', 'template_odh7vlb', templateParams)
}

const form = document.getElementById('contactForm')
const submitBtn = document.getElementById('submitBtn')
const statusBox = document.getElementById('formStatus')

function setStatus(message, kind = 'info') {
  if (!statusBox) {
    return
  }
  statusBox.classList.remove('hidden')
  // Base styles
  statusBox.className = 'mt-2 text-sm p-3 rounded-md border '
  const theme = {
    info: 'border-lumi-300 dark:border-lumi-700 bg-lumi-50/40 dark:bg-lumi-900/30 text-lumi-800 dark:text-lumi-200',
    success:
      'border-green-400 bg-green-400/10 text-green-600 dark:text-green-300',
    error: 'border-red-400 bg-red-400/10 text-red-600 dark:text-red-300',
  }
  statusBox.className += theme[kind] || theme.info
  statusBox.textContent = message
}

function clearStatus() {
  if (!statusBox) {
    return
  }
  statusBox.textContent = ''
  statusBox.classList.add('hidden')
}

function setError(input, message) {
  const p = form?.querySelector(`[data-error-for="${input.id}"]`)
  if (p) {
    p.textContent = message || ''
    p.classList.toggle('hidden', !message)
  }
  input?.classList.toggle('border-red-400', Boolean(message))
}

function validate() {
  let valid = true
  const name = document.getElementById('name')
  const email = document.getElementById('email')
  const message = document.getElementById('message')

  // Name
  const nameVal = name.value.trim()
  if (!nameVal) {
    setError(name, 'Informe seu nome.')
    valid = false
  } else if (nameVal.length < 2) {
    setError(name, 'O nome deve ter pelo menos 2 caracteres.')
    valid = false
  } else {
    setError(name, '')
  }

  // Email
  const emailVal = email.value.trim()
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
  if (!emailVal) {
    setError(email, 'Informe seu e-mail.')
    valid = false
  } else if (emailRe.test(emailVal)) {
    setError(email, '')
  } else {
    setError(email, 'Forneça um e-mail válido.')
    valid = false
  }

  // Message
  const msgVal = message.value.trim()
  if (!msgVal) {
    setError(message, 'Digite sua mensagem.')
    valid = false
  } else if (msgVal.length < 10) {
    setError(message, 'A mensagem deve ter pelo menos 10 caracteres.')
    valid = false
  } else {
    setError(message, '')
  }

  return { valid, values: { name: nameVal, email: emailVal, message: msgVal } }
}

function setLoading(loading) {
  if (!submitBtn) {
    return
  }
  submitBtn.disabled = loading
  submitBtn.classList.toggle('opacity-70', loading)
  submitBtn.classList.toggle('cursor-not-allowed', loading)
  const span = submitBtn.querySelector('span')
  if (span) {
    span.textContent = loading ? 'Enviando…' : 'Enviar'
  }
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  clearStatus()
  const { valid, values } = validate()
  if (!valid) {
    setStatus('Por favor, corrija os campos destacados.', 'error')
    return
  }

  try {
    setLoading(true)
    await sendContactEmail(values.name, values.message, values.email)
    setStatus('Mensagem enviada com sucesso. Obrigado pelo contato!', 'success')
    form.reset()
  } catch (err) {
    console.error(err)
    setStatus(
      'Não foi possível enviar sua mensagem. Tente novamente em instantes.',
      'error'
    )
  } finally {
    setLoading(false)
  }
})

// Live validation on blur
for (const id of ['name', 'email', 'message']) {
  const el = document.getElementById(id)
  el?.addEventListener('blur', () => validate())
}
