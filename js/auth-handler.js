import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { auth } from "../services/firebase.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (user) {
    // Se autenticado, redireciona de /login ou /register para /dashboard
    if (
      path === "/login/" ||
      path === "/register/" ||
      path === "/login" ||
      path === "/register"
    ) {
      window.location.replace("/dashboard/");
    }
  } else {
    // Se não autenticado, redireciona de /dashboard para /login
    if (path === "/dashboard/" || path === "/dashboard") {
      window.location.replace("/login/");
    }
  }
});
