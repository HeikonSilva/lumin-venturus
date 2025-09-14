const root = document.documentElement;
const toggle = document.getElementById("modeToggle");
const label = document.getElementById("modeLabel");
const PREF_KEY = "lumin-theme";
function applyTheme(theme) {
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  if (label)
    label.textContent = root.classList.contains("dark") ? "Dark" : "Light";
}
const stored =
  localStorage.getItem(PREF_KEY) ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
applyTheme(stored);
toggle?.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(PREF_KEY, next);
  applyTheme(next);
});
