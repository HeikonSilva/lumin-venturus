import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/lumin-venturus/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        register: resolve(__dirname, "register/index.html"),
        login: resolve(__dirname, "login/index.html"),
        features: resolve(__dirname, "features/index.html"),
        contactus: resolve(__dirname, "contact-us/index.html"),
        aboutus: resolve(__dirname, "about-us/index.html"),
      },
    },
  },
});
