import { supabase } from "../../services/supabase.js";

export function mountUserInfo(containerId = "userInfo") {
  const el = document.getElementById(containerId);
  if (!el) return;

  function render(user) {
    if (!user) {
      el.innerHTML = "";
      return;
    }
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "Usuário";
    const avatar =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" +
        encodeURIComponent(name);

    el.innerHTML = `
      <div class="lumi-border p-3 flex items-center gap-3">
        <img src="${avatar}" alt="Avatar" class="w-8 h-8 rounded-full object-cover border border-white/10" />
        <div class="min-w-0">
          <p class="text-sm font-medium truncate">${name}</p>
          <p class="text-[11px] text-lumi-400 truncate">${user.email || ""}</p>
        </div>
      </div>
    `;
  }

  // Initial and reactive
  supabase.auth
    .getSession()
    .then(({ data }) => render(data.session?.user || null));
  supabase.auth.onAuthStateChange((_event, session) =>
    render(session?.user || null)
  );
}
