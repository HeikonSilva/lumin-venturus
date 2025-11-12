// Responsive navbar: handles mobile menu toggle and normalizes hrefs for GitHub Pages subpaths
;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu expand/collapse
    const toggle = document.getElementById('menuToggle')
    const menu = document.getElementById('mobileMenu')
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('hidden')
      })
    }
  })
})()
