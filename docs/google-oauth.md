# Autenticação com Google (OAuth)

A autenticação com o Google funciona por meio de OAuth.

Para este passo, é necessário já ter feito a [configuração do Supabase](./supabase.md).

## 1. Criar projeto no Google Cloud

Entre no [Google Cloud Console](https://console.cloud.google.com).

![Google Cloud](./images/google-oauth/cloud.png)

Crie um projeto e defina o nome.

![Project Name](./images/google-oauth/create-project-name.png)

Após a criação, você será redirecionado ao Google Cloud. Selecione o projeto criado.

![Project Selection](./images/google-oauth/select-project.png)

## 2. Configurar Tela de Permissão OAuth

Na barra lateral, em "APIs e Serviços", acesse "Tela de permissão OAuth".

![OAuth Screen](./images/google-oauth/aside-nav-oauth-screen.png)

Você deve ver a visão geral. Vamos criar um cliente OAuth; comece por aqui.

![OAuth Overview](./images/google-oauth/oauth-overview.png)

Preencha os dados e crie a configuração de autenticação do projeto. Para uso público, prefira a opção "Externo", permitindo login com Google por qualquer usuário.

![All Checks](./images/google-oauth/all-checks.png)

## 3. Criar um OAuth Client

Crie um Cliente OAuth.

![OAuth Client Onboard](./images/google-oauth/client-onboard.png)

Defina o tipo como "Aplicativo da Web" e dê um nome.

![Client Creation](./images/google-oauth/client-creation.png)

Mais abaixo, em "Origens JavaScript autorizadas", insira o endereço de hospedagem do frontend.

![Authorized Origins](./images/google-oauth/origin.png)

Em "URIs de redirecionamento autorizados", utilize a URL de callback disponível no [Supabase](https://supabase.com/dashboard) em Authentication > Sign in / Providers > Google.

![Callback Url](./images/google-oauth/callback-url.png)

![Callback Url Supabase](./images/google-oauth/supabase-callback-url.png)

Após a criação, um popup exibirá o Client ID e o Client Secret.

![Client Id](./images/google-oauth/client-id.png)
![Client Secret](./images/google-oauth/client-secret.png)

Agora insira esses dados nos campos correspondentes no Supabase e marque a opção "Enable Sign in with Google".

![Google Settings](./images/google-oauth/google-settings.png)

## Aviso

A autenticação com Google pode demorar alguns minutos para funcionar após a configuração inicial.
