import { supabase } from "../../services/supabase.js";

function getBasePrefix() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length > 1 && /github\.io$/.test(window.location.host)) {
    return `/${parts[0]}`;
  }
  return "";
}

export async function setupLogout(buttonId = "logoutBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      await supabase.auth.signOut();
      // auth-handler will redirect if necessary, but force navigate for safety
      const base = getBasePrefix();
      window.location.replace(`${base}/login/`);
    } catch (err) {
      console.error("Falha ao sair:", err);
      alert("Não foi possível finalizar a sessão agora.");
    } finally {
      btn.disabled = false;
    }
  });
}
