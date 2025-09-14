// Responsive navbar: handles mobile menu toggle and normalizes hrefs for GitHub Pages subpaths
(function () {
  function getBasePrefix() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length > 1 && /github\.io$/.test(window.location.host)) {
      // On GitHub Pages: /<user>/<repo>/...
      return `/${parts[0]}`;
    }
    return "";
  }
  const base = getBasePrefix();

  document.addEventListener("DOMContentLoaded", () => {
    // Normalize links that declare a data-route attribute
    document.querySelectorAll("a[data-route]").forEach((a) => {
      const route = a.getAttribute("data-route") || "/";
      try {
        a.setAttribute("href", `${base}${route}`);
      } catch {}
    });

    // Mobile menu expand/collapse
    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("mobileMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    }
  });
})();
