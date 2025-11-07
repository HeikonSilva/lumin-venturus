const root = document.documentElement
const legacyToggle = document.getElementById('modeToggle')
const legacyLabel = document.getElementById('modeLabel')
const PREF_KEY = 'lumin-theme'

// Icons (as requested)
const ICON_SUN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
const ICON_MOON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>'

let floatingBtn = null

function ensureFloatingButton() {
  if (floatingBtn) {
    return floatingBtn
  }
  const btn = document.createElement('button')
  btn.id = 'floatingThemeToggle'
  btn.type = 'button'
  btn.setAttribute('aria-label', 'Alternar tema')
  // Position bottom-right, above content
  btn.style.position = 'fixed'
  btn.style.right = '16px'
  btn.style.bottom = '86px'
  btn.style.width = '48px'
  btn.style.height = '48px'
  btn.style.borderRadius = '100%'
  btn.ariaLabel = 'Trocar tema'
  btn.style.display = 'grid'
  btn.style.placeItems = 'center'
  btn.style.zIndex = '1000'
  // Subtle glass background and border using existing theme
  btn.style.backdropFilter = 'blur(8px)'
  btn.style.border = '1px solid rgba(255,255,255,0.15)'
  // Colors will be adjusted in applyTheme

  btn.addEventListener('click', () => {
    const next = root.classList.contains('dark') ? 'light' : 'dark'
    localStorage.setItem(PREF_KEY, next)
    applyTheme(next)
  })

  document.body.appendChild(btn)
  floatingBtn = btn
  return btn
}

function updateFloatingButton(theme) {
  const btn = ensureFloatingButton()
  // Set icon according to current theme (light -> sun, dark -> moon)
  btn.innerHTML = theme === 'dark' ? ICON_MOON : ICON_SUN
  // Adaptive colors
  if (theme === 'dark') {
    btn.style.background = 'rgba(255,255,255,0.06)'
    btn.style.color = '#e5e7eb' // tailwind zinc-200
    btn.style.border = '1px solid rgba(255,255,255,0.12)'
  } else {
    btn.style.background = 'rgba(0,0,0,0.05)'
    btn.style.color = '#111827' // tailwind gray-900
    btn.style.border = '1px solid rgba(0,0,0,0.08)'
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // Update any legacy label if present
  if (legacyLabel) {
    legacyLabel.textContent = root.classList.contains('dark') ? 'Dark' : 'Light'
  }

  // Update floating button appearance
  updateFloatingButton(theme)
}

const stored =
  localStorage.getItem(PREF_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

// Initialize theme and ensure button exists
ensureFloatingButton()
applyTheme(stored)

// Hook legacy toggle if it exists (kept for compatibility)
legacyToggle?.addEventListener('click', () => {
  const next = root.classList.contains('dark') ? 'light' : 'dark'
  localStorage.setItem(PREF_KEY, next)
  applyTheme(next)
})

// Hide legacy toggle from the UI, since we now use the floating button
if (legacyToggle) {
  legacyToggle.style.display = 'none'
}
