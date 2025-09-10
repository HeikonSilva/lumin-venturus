import {
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { auth } from "../../services/firebase.js";
import { sendVerificationEmail } from "../../js/send-email.js";

const provider = new GoogleAuthProvider();

const loginWithGoogle = document.getElementById("login-google");

if (loginWithGoogle) {
  loginWithGoogle.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  });
}
