import { supabase } from "../../services/db.js";

const form = document.loginForm;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(`Falha no login: ${error.message}`);
    return;
  }

  if (data?.session) {
    // auth-handler cuidará do redirect
  }
});
