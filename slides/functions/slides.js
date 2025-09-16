import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const slideEl = document.getElementById("slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const slides = [
  {
    title: "Logo + Slogan",
    html: () => `
      <section class="grid place-items-center text-center gap-8">
        <div class="flex items-center justify-center">
          <!-- Logo Lumin animado -->
          <svg id="luminLogo" class="mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274.56 274.56" width="274.56" height="274.56" role="img" aria-label="Lumin">
            <defs>
              <style>
                .cls-1 { fill: #bae2f7; stroke: #bae2f7; stroke-width: 2; }
                .cls-2 { fill: #058099; stroke: #058099; stroke-width: 2; }
              </style>
            </defs>
            <circle class="cls-1 lumi-animation-1" cx="137.28" cy="137.28" r="58.52"></circle>
            <path class="cls-2 lumi-animation-2" d="M151.65,56.06h-28.73c-4.06,0-6.95-3.97-5.69-7.83l14.37-44.1c1.79-5.5,9.58-5.5,11.37,0l14.37,44.1c1.26,3.86-1.62,7.83-5.69,7.83Z"></path>
            <path class="cls-2 lumi-animation-3" d="M122.91,218.5h28.73c4.06,0,6.95,3.97,5.69,7.83l-14.37,44.1c-1.79,5.5-9.58,5.5-11.37,0l-14.37-44.1c-1.26-3.86,1.62-7.83,5.69-7.83Z"></path>
            <path class="cls-2 lumi-animation-4" d="M218.5,151.65v-28.73c0-4.06,3.97-6.95,7.83-5.69l44.1,14.37c5.5,1.79,5.5,9.58,0,11.37l-44.1,14.37c-3.86,1.26-7.83-1.62-7.83-5.69Z"></path>
            <path class="cls-2 lumi-animation-5" d="M209.04,84.8l-14.64-14.64c-2.07-2.07-1.52-5.56,1.09-6.89l29.79-15.15c3.72-1.89,7.68,2.08,5.79,5.79l-15.15,29.79c-1.33,2.61-4.82,3.16-6.89,1.09Z"></path>
            <path class="cls-2 lumi-animation-6" d="M194.4,203.51l14.64-14.64c2.07-2.07,5.56-1.52,6.89,1.09l15.15,29.79c1.89,3.72-2.08,7.68-5.79,5.79l-29.79-15.15c-2.61-1.33-3.16-4.82-1.09-6.89Z"></path>
            <path class="cls-2 lumi-animation-7" d="M56.06,122.91v28.73c0,4.06-3.97,6.95-7.83,5.69l-44.1-14.37c-5.5-1.79-5.5-9.58,0-11.37l44.1-14.37c3.86,1.26,7.83,1.62,7.83,5.69Z"></path>
            <path class="cls-2 lumi-animation-8" d="M80.16,71.06l-14.64,14.64c-2.07,2.07-5.56,1.52-6.89-1.09l-15.15-29.79c-1.89-3.72,2.08-7.68,5.79-5.79l29.79,15.15c2.61,1.33,3.16,4.82,1.09,6.89Z"></path>
            <path class="cls-2 lumi-animation-9" d="M65.52,188.87l14.64,14.64c2.07,2.07,1.52,5.56-1.09,6.89l-29.79,15.15c-3.72,1.89-7.68-2.08-5.79-5.79l15.15-29.79c1.33-2.61,4.82-3.16,6.89-1.09Z"></path>
          </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-sky-200">Lumin</h1>
        <p class="text-2xl md:text-3xl font-bold text-sky-300">Organize, Aprenda & Evolua</p>
      </section>
    `,
    onEnter: (root) => {
      const logo = root.querySelector("#luminLogo");
      if (logo) setTimeout(() => logo.classList.add("active"), 80);
    },
  },
  {
    title: "Participantes",
    html: () => `
      <section class="space-y-10">
        <h2 class="text-3xl md:text-4xl font-semibold">Equipe</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <article class="flex flex-col items-center gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/60">
            <div class="h-28 w-28 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center text-sky-300/70">
              <img src="../assets/heikon.jpg" alt="Heikon Silva Costa" class="h-full w-full rounded-full object-cover" />
            </div>
            <div class="text-center">
              <h3 class="text-xl font-medium">Heikon Silva</h3>
              <p class="text-slate-400 text-sm">Back-End e Infraestrutura</p>
            </div>
          </article>
          <article class="flex flex-col items-center gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/60">
            <div class="h-28 w-28 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center text-sky-300/70">
              <img src="../assets/jhonatan.jpg" alt="Jhonatan Oliveira Aranha" class="h-full w-full rounded-full object-cover" />
            </div>
            <div class="text-center">
              <h3 class="text-xl font-medium">Jhonatan Oliveira</h3>
              <p class="text-slate-400 text-sm">Front-End e UX</p>
            </div>
          </article>
          <article class="flex flex-col items-center gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/60">
            <div class="h-28 w-28 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center text-sky-300/70">
              <img src="../assets/arthur.jpg" alt="Arthur Pereira" class="h-full w-full rounded-full object-cover" />
            </div>
            <div class="text-center">
              <h3 class="text-xl font-medium">Arthur Pereira</h3>
              <p class="text-slate-400 text-sm">Apresentação e Design UI</p>
            </div>
          </article>
        </div>
      </section>
    `,
  },
  {
    title: "Problema",
    html: () => `
      <section class="space-y-6">
        <h2 class="text-3xl md:text-4xl font-semibold">O problema que queremos resolver</h2>
        <p class="text-lg text-slate-300">
          Nós da equipe Lumin antes de apresentar nosso projeto, gostariamos de comentar e compreender os desafios que ainda existem nas agendas digitais dos nossos dias que mesmo com ferramentas modernas não atendem a real necessidade dos academicos que a usam.
        </p>
        <ul class="grid gap-3 text-lg marker:text-sky-400 list-disc ml-6">
          <li>Atividades e planejamentos dispersos</li>
          <li>Experiência confusa e ineficiente</li>
          <li>Falta de recursos auxiliadores</li>
          <li>Dificuldade em acompanhar o avanço das atividades</li>
        </ul>
      </section>
    `,
  },
  {
    title: "Detalhamento do projeto",
    html: () => `
      <section class="space-y-6">
        <h2 class="text-3xl md:text-4xl font-semibold">Sobre o Lumin</h2>
        <p class="text-lg text-slate-300">
          Com a análise desses problemas, desenvolvemos essa aplicação que a nomeamos de: Lumin.
        </p>
        <p class="text-lg text-slate-300">
          A Lumin tem a missão de, através de criatividade e inovação, simplificar e auxiliar a organização do seu dia a dia.
        </p>
      </section>
    `,
  },
  {
    title: "Nosso diferencial",
    html: () => `
      <section class="space-y-6">
        <h2 class="text-3xl md:text-4xl font-semibold">Nosso diferencial</h2>
        <p class="text-lg text-slate-300">
          A Lumin te oferece ferramentas e soluções para organização fácil de seus objetivos, oferecendo integração com IA e o incomumente utilizado kanban cards.
        </p>
      </section>
    `,
  },
  {
    title: "Próximos objetivos",
    html: () => `
      <section class="space-y-6">
        <h2 class="text-3xl md:text-4xl font-semibold">Próximos objetivos</h2>
        <ul class="grid gap-3 text-lg marker:text-sky-400 list-disc ml-6">
          <li>Lançar MVP e coletar feedback dos acadêmicos</li>
          <li>Aprimorar assistente de IA para planejamento inteligente</li>
          <li>Implementar recursos de colaboração de grupo</li>
        </ul>
      </section>
    `,
  },
  {
    title: "Obrigado + QR Code",
    html: () => `
      <section class="grid gap-8 place-items-center text-center">
        <h2 class="text-3xl md:text-4xl font-semibold">Obrigado pela atenção!</h2>
        <p class="text-lg text-slate-300">Acesse o site do Lumin pelo QR code</p>
        <div class="p-4 rounded-xl border border-dashed border-sky-400/40">
          <!-- Troque o src abaixo pelo caminho do seu QR code -->
          <img src="../assets/qr.jpeg" alt="QR code do site Lumin" class="h-48 w-48 object-contain rounded-lg" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
          <div class="hidden place-items-center h-48 w-48 text-sky-300/70">
            Adicione seu QR em: assets/qr.png
          </div>
        </div>
        <p class="text-slate-400">Em seguida, apresentaremos o funcionamento da plataforma.</p>
      </section>
    `,
  },
];

let current = 0;

async function renderSlide(index, direction = 1) {
  if (index < 0 || index >= slides.length || index === current) return;

  // anima saída
  if (slideEl.childElementCount) {
    await animate(
      slideEl,
      { opacity: [1, 0], x: [0, direction > 0 ? -24 : 24] },
      { duration: 0.25, easing: "ease-out" }
    ).finished;
  }

  slideEl.innerHTML = slides[index].html();

  // anima entrada
  animate(
    slideEl,
    { opacity: [0, 1], x: [direction > 0 ? 24 : -24, 0] },
    { duration: 0.35, easing: "ease-out" }
  );

  // callback de entrada
  slides[index].onEnter?.(slideEl);

  current = index;
  updateButtons();
}

function updateButtons() {
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

function goNext() {
  if (current < slides.length - 1) renderSlide(current + 1, 1);
}
function goPrev() {
  if (current > 0) renderSlide(current - 1, -1);
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goNext();
  if (e.key === "ArrowLeft") goPrev();
});

// inicia no primeiro slide
(function init() {
  slideEl.innerHTML = slides[0].html();
  slides[0].onEnter?.(slideEl);
  animate(
    slideEl,
    { opacity: [0, 1], y: [12, 0] },
    { duration: 0.35, easing: "ease-out" }
  );
  updateButtons();
})();
