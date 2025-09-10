emailjs.init({
  publicKey: "kexJvWlUpu-iTv-6m",
});

export function sendVerificationEmail(toEmail, verificationLink) {
  emailjs.send("service_useuat9", "template_vqu25e5", {
    website_url: window.location.origin,
    email: toEmail,
    verification_link: verificationLink,
  });
}
