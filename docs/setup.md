## ⚙️ Instruções de Setup

### 1. Clone do Repositório

```bash
git clone https://github.com/HeikonSilva/lumin-venturus.git
cd lumin-venturus
```

### 2. Configuração do Supabase

Defina as credenciais do Supabase em `services/supabase.js` e garanta que `services/db.js` exporta o cliente corretamente.

### 3. Execução Local

#### Instalação de Dependências

```bash
pnpm install
```

#### Modo de Desenvolvimento

```bash
pnpm dev
```

O servidor de desenvolvimento será iniciado (geralmente em `http://localhost:5173`).

#### Build e Preview

Para gerar a build de produção:

```bash
pnpm build
```

Para servir a build localmente:

```bash
pnpm preview
```

A url de acesso padrão será: http://localhost:5173/lumin-venturus/ ou http://localhost:4173/lumin-venturus/

### 3.1 Aviso importante (Firebase, Supabase e OAuth)

Este projeto utiliza, respectivamente, como serviço de IA e backend: Firebase e Supabase. Em produção, ambos os serviços autorizam apenas a URL hospedada no GitHub Pages do projeto.

- Não abra os arquivos HTML diretamente com file://. Sirva via http/https (ex.: `pnpm dev` ou `pnpm preview`).

Para configurar os serviços e a autenticação localmente, consulte os guias completos:

- Configuração do Supabase: [docs/supabase.md](./supabase.md)
- Autenticação anônima (Convidado): [docs/anonymus-signin.md](./anonymus-signin.md)
- Configuração do Firebase (Gemini AI): [docs/firebase.md](./firebase.md)
- Login com Google (OAuth): [docs/google-oauth.md](./google-oauth.md)
