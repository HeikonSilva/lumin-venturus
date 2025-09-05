const nav = `<a href="/src/#/">Home</a> | 
                   <a href="/src/#/about">About</a> | 
                   <a href="/src/#/contact">Contact</a>`;

const routes = {
  "": `<h1>Home</h1>${nav}<p>Welcome home!</p>`,
  about: `<h1>About</h1>${nav}<p>This is a tiny SPA</p>`,
};
const render = (path) => {
  document.querySelector("#app").innerHTML =
    routes[path.replace(/^#\//, "")] ?? `<h1>404</h1>${nav}`;
};
window.onhashchange = (evt) => render(window.location.hash);
render(window.location.hash);
