document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("luminLogoHero");
  if (!logo) return;

  const activate = () => logo.classList.add("active");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          setTimeout(activate, 80);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(logo);
  } else {
    setTimeout(activate, 120);
  }
});
