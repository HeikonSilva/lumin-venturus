# Configuração do Firebase

O Firebase no Lumin é utilizado para a funcionalidade de IA por meio de uma integração com o Gemini AI da Google.

## 1. Criar o projeto

Entre no site [Firebase Console](https://console.firebase.google.com/u/0/)

![Onboard](./images/firebase/onboard.png)

Crie um projeto.

![Criação de projeto](./images/firebase/project-setup.png)

Habilite a Assistência de IA (opcional).

![Assistência de IA](./images/firebase/project-setup-1.png)

Habilite o Google Analytics (opcional).

![Google Analytics](./images/firebase/project-setup-2.png)

Se ativou o Google Analytics, defina a conta.

![Google Analytics](./images/firebase/google-analytics.png)

Concluída a criação, seu projeto estará pronto.

![Projeto Criado](./images/firebase/project-created.png)

Ao criar o projeto, você deve ser redirecionado para este dashboard:

![App Onboard](./images/firebase/app-onboard.png)

## 2. Ativar Gemini (AI) no Firebase

Na barra lateral, entre em AI > AI Logic e clique em "Get started".

![AI Logic](./images/firebase/ai-logic.png)

Uma janela de escolha aparecerá. Selecione o modelo de IA:

- Gemini Developer API: sem custo.
- Vertex AI Gemini API: voltado a serviços corporativos de grande escala.

Para este projeto, escolha Gemini Developer API.

![AI Model](./images/firebase/ai-logic-model.png)

Após clicar em "Get started", começará o processo de habilitação da IA. Prossiga com "Enable".

![Gemini Developer API](./images/firebase/gemini-api-enabling.png)

O monitoramento da IA habilita telemetria de uso (opcional).

## 3. Registrar um app Web

Agora que a IA está ativada, crie um aplicativo do tipo Web no Firebase.

![App Creation](./images/firebase/app-creation.png)

Defina um nome. A caixa "Also set up Firebase Hosting for this app" não é necessária. Continue.

![App Creation Name](./images/firebase/app-creation-name.png)

O Firebase exibirá o código necessário para usar o app que você criou. Copie o trecho destacado.

![Sdk CDN](./images/firebase/sdk-cdn.png)

Abra o arquivo `services/firebase.js` no seu editor e substitua o objeto de configuração (o trecho destacado em vermelho) pelo snippet copiado anteriormente.

![Firebase Configuration](./images/firebase/firebase-config.png)

Pronto, o Firebase está configurado para uso.

## Leia também

- [Configuração do Supabase](./supabase.md)
- [Hospedagem local do projeto](./setup.md)
