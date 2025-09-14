import { signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { auth } from "../../services/firebase.js";

const loginAnonymus = document.getElementById("login-guest");

if (loginAnonymus) {
  loginAnonymus.addEventListener("click", () => {
    signInAnonymously(auth)
      .then(() => {
        // Signed in..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorMessage);
      });
  });
}
