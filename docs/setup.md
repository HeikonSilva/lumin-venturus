## ⚙️ Instruções de Setup

### 1. Clone do Repositório

```bash
git clone https://github.com/HeikonSilva/lumin-venturus.git
cd lumin-venturus
```

### 2. Configuração do Supabase

Defina as credenciais do Supabase em `services/supabase.js` e garanta que `services/db.js` exporta o cliente corretamente.

### 3. Execução Local

#### Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

### 3.1 Aviso importante (Firebase, Supabase e OAuth)

Este projeto utiliza, respectivamente, como serviço de IA e backend: Firebase e Supabase. Em produção, ambos os serviços estão configurados para autorizar apenas a URL hospedada no GitHub Pages do projeto. Para executar localmente, siga os passos abaixo.

- Não abra os arquivos HTML diretamente com file://. Isso fará com que os serviços do Supabase e Firebase falhem (CORS/redirect). O site precisa ser servido via http/https (ex.: Live Server no VS Code).

Firebase (obrigatório para rodar localmente):

1. Crie um projeto no Firebase e registre um app Web.
2. Copie o objeto `firebaseConfig` fornecido pelo Firebase e substitua o que está configurado em `services/firebase.js`.
3. Acesse Authentication > Settings (Configurações) > Authorized domains (Domínios autorizados) e adicione:
   - `localhost`
   - ou `127.0.0.1:5500` (porta padrão usada pela extensão Live Server)

Supabase (obrigatório para rodar localmente):

1. Crie um projeto no Supabase.
2. Em Project Settings > Data API > Project URL, copie:
   - Project URL
   - Publishable (anon/public) key (localizada em Project Settings > API Keys)
     Configure esses valores em `services/supabase.js`.
3. Em Authentication > URL Configuration > Site URL, defina a URL do frontend (por exemplo: `http://localhost:5500`).
4. Em Authentication > Providers, habilite:
   - Allow anonymous sign-ins
   - Email
   - Google

Passos opcionais:

- Template de e-mail de confirmação de cadastro:
  - Em Authentication > Email Templates > Confirm signup, cole o HTML de `email-templates/confirm-signup.html`.
- Login com Google (OAuth):
  1. No Google Cloud Console, crie um projeto e configure a Tela de Consentimento OAuth.
  2. Crie um OAuth Client ID (Application type: Web application).
  3. Configure:
     - Authorized JavaScript origins: a URL do seu projeto no Supabase (ex.: `https://SEU_PROJECT_REF.supabase.co`)
     - Authorized redirect URIs: `https://SEU_PROJECT_REF.supabase.co/auth/v1/callback`
  4. Após criar o OAuth Client, copie o Client ID e o Client Secret.
  5. No painel do Supabase, acesse Authentication > Providers > Google e cole o Client ID e Client Secret para habilitar o login com Google.

Após essas configurações, sirva o frontend (ex.: Live Server) e acesse `http://localhost:5500`.
