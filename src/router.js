const nav = `<a href="/src/#/">Home</a> | 
                   <a href="/src/#/about">About</a> | 
                   <a href="/src/#/contact">Contact</a>`;

const routes = {
  "": `<div
      class="absolute top-8 right-8 left-8 w-[100vw-4rem] h-16 bg-white rounded-lg"
    ></div>
    <div class="min-h-screen bg-neutral-950"></div>`,
  about: `<h1>About</h1>${nav}<p>This is a tiny SPA</p>`,
};
const render = (path) => {
  document.querySelector("#app").innerHTML =
    routes[path.replace(/^#\//, "")] ?? `<h1>404</h1>${nav}`;
};
window.onhashchange = (evt) => render(window.location.hash);
render(window.location.hash);
