![Lumin Logo](./assets/meta.png)

## 📚 Informações do Projeto

**Nome do Projeto:** Lumin - Plataforma de Organização de Estudos

**ETEC:** ETEC Lauro Gomes

**Turma:** 1ª Série | Turma E | Desenvolvimento de sistemas

**Integrantes da Equipe:**

- Arthur Pereira Faria
- Heikon Silva Costa
- Jhonatan Oliveira Aranha

## 🎯 Descrição do Projeto

### Problema Identificado

Estudantes enfrentam dificuldades para organizar suas atividades acadêmicas, gerenciar prazos e manter um cronograma de estudos eficiente. A falta de uma ferramenta centralizada que combine organização de tarefas, calendário e recursos de IA resulta em baixa produtividade e estresse acadêmico.

### Solução Proposta

Lumin é uma plataforma web moderna que oferece:

- **🗂️ Kanban Board**: Sistema visual para organização de tarefas de estudo
- **📅 Calendário Integrado**: Gestão de prazos e cronogramas
- **🤖 Assistente IA**: Sugestões inteligentes para otimização dos estudos
- **👤 Sistema de Autenticação**: Dados seguros e personalizados por usuário
- **📊 Acompanhamento de Progresso**: Métricas de evolução nos estudos

## 🚀 Funcionalidades

<!-- ### ✅ Implementadas

- Autenticação de usuários (Supabase Auth)
- Kanban de tarefas com realtime (criar/listar/mover) e drag & drop
- Modo escuro/claro

### 🔄 Em Desenvolvimento

- Calendário de estudos
- Assistente IA (sugestões e ações operacionais)
- Edição e exclusão de tarefas (CRUD completo)
- Sistema de notificações
- Relatórios de produtividade
- Integração com APIs externas
- Sistema de gamificação -->

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Backend**: Supabase (Auth, Postgres, Realtime)
- **Bibliotecas**: FullCalendar.js (planejado)
- **Ferramentas**: Git, VS Code, Five Server (desenvolvimento)

## 📋 Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para bibliotecas CDN)
- Editor de código (recomendado: VS Code)
- Git instalado

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

### 4. Acesso à Aplicação

- **URL Local**: `http://localhost:5500` (ou porta configurada)
- **Página Inicial**: Interface de apresentação do projeto
- **Login**: `/login/` - Autenticação de usuários
- **Registro**: `/register/` - Criação de contas
- **Dashboard**: `/dashboard/` - Kanban de tarefas (requer login)
- **Calendário**: `/dashboard/calendar/` - Cronograma de estudos
- **IA**: `/dashboard/ai/` - Assistente inteligente

## 📱 Como Usar

### 1. Criar Conta

1. Acesse `/register/`
2. Preencha email e senha
3. Clique em "Criar Conta"

### 2. Fazer Login

1. Acesse `/login/`
2. Insira suas credenciais
3. Será redirecionado para o dashboard

### 3. Gerenciar Tarefas

1. No dashboard, clique em "Adicionar Tarefa"
2. Preencha: título, descrição, prioridade, matéria e prazo
3. A tarefa aparecerá na coluna "A Fazer"
4. Arraste entre colunas para alterar status
5. Use os botões de editar (✎) e deletar (×) conforme necessário

### 4. Visualizar Calendário

1. Acesse "Calendário" no menu lateral
2. Visualize tarefas organizadas por data
3. Clique em eventos para ver detalhes

## 📂 Estrutura do Projeto

```
lumin-venturus/
├── index.html              # Página inicial
├── style.css              # Estilos Tailwind compilados
├── README.md              # Documentação
├── assets/                # Recursos estáticos
│   ├── lumi.svg          # Logo do projeto
│   ├── meta.png          # Imagem de compartilhamento
│   └── favicon/          # Ícones da aplicação
├── services/
│   └── firebase.js       # Configuração Firebase
├── js/
│   ├── auth-handler.js   # Gerenciamento de autenticação
│   └── kanban-manager.js # Gerenciador do Kanban
├── dashboard/
│   ├── index.html        # Dashboard principal
│   ├── ai/index.html     # Assistente IA
│   ├── calendar/index.html # Calendário
│   └── functions/        # Funções do dashboard
│       ├── create-task.js # CRUD de tarefas
│       └── query-tasks.js # Consultas de tarefas
├── login/
│   ├── index.html        # Página de login
│   └── functions/        # Funções de autenticação
├── register/
│   ├── index.html        # Página de registro
│   └── functions/
└── about-us/
    └── index.html        # Página sobre a equipe
```

## 🔐 Recursos de Segurança

- Autenticação via Firebase Authentication
- Dados isolados por usuário
- Validação de formulários
- Proteção contra acesso não autorizado

## 🌐 Deploy

O projeto está configurado para deploy no GitHub Pages:

- **URL de Produção**: `https://heikonsilva.github.io/lumin-venturus/`
- **Branch de Deploy**: `main`

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do programa Lumin da ETEC Lauro Gomes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato com a equipe através dos commits do GitHub ou issues do repositório.

---

**Lumin** - _Organize, Aprenda & Evolua_ 💡
