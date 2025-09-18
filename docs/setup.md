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

Este projeto utiliza, respectivamente, como serviço de IA e backend: Firebase e Supabase. Em produção, ambos os serviços autorizam apenas a URL hospedada no GitHub Pages do projeto.

- Não abra os arquivos HTML diretamente com file://. Sirva via http/https (ex.: Live Server no VS Code).

Para configurar os serviços e a autenticação localmente, consulte os guias completos:

- Configuração do Supabase: [docs/supabase.md](./supabase.md)
- Autenticação anônima (Convidado): [docs/anonymus-signin.md](./anonymus-signin.md)
- Configuração do Firebase (Gemini AI): [docs/firebase.md](./firebase.md)
- Login com Google (OAuth): [docs/google-oauth.md](./google-oauth.md)

Depois de configurar, sirva o frontend (ex.: Live Server) e acesse `http://localhost:5500`.
