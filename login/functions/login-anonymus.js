import { supabase } from "../../services/db.js";

const loginAnonymus = document.getElementById("login-guest");

if (loginAnonymus) {
  loginAnonymus.addEventListener("click", () => {
    // Supabase: Anônimo (previa/beta). Alternativa: Magic Link sem e-mail
    supabase.auth.signInAnonymously().then(({ error }) => {
      if (error) alert(`Erro no login anônimo: ${error.message}`);
      // auth-handler fará o redirect se sucesso
    });
  });
}
