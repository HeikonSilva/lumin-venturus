import { sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { auth } from "../../services/firebase.js";
// import { sendVerificationEmail } from "../../js/send-email.js";

const magicLinkForm = document.querySelector('form[name="magic-link"');

const actionCodeSettings = {
  url: "http://127.0.0.1:5500/verify-email",
  handleCodeInApp: true,
};

if (magicLinkForm) {
  magicLinkForm.addEventListener("submit", function (event) {
    sendSignInLinkToEmail(auth, magicLinkForm.email.value, actionCodeSettings)
      .then(() => {
        alert(magicLinkForm.email.value);
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  });
}
