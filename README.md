# 🎙️ Truedy Voice AI Proxy Server

Este é um servidor proxy seguro para integrar o botão de voz da **Truedy.ai** em qualquer site. Ele protege sua API Key e gerencia a conexão WebRTC.

## 🚀 Como fazer funcionar (Local)

1. **Configurar as Chaves:**
   - Abra o arquivo `.env` e substitua `YOUR_TRUEDY_API_KEY_HERE` pela sua chave (peça no dashboard da Truedy).
   - Abra o arquivo `public/widget.js` e substitua `YOUR_AGENT_UUID_HERE` pelo ID do seu agente.

2. **Instalar e Rodar:**
   No terminal, dentro da pasta do projeto, execute:
   ```bash
   npm install
   npm run dev
   ```

3. **Testar:**
   Abra `http://localhost:3000` no seu navegador. O botão aparecerá no canto inferior direito!

---

## ☁️ Como hospedar GRATUITAMENTE

Para que seu botão funcione no site real, o servidor precisa estar online. Recomendo o **Render.com** por ser o mais simples e gratuito:

1. Crie uma conta no [Render.com](https://render.com).
2. Conecte seu GitHub (ou faça upload do código).
3. Crie um novo **Web Service**.
4. Nas configurações:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Vá em **Environment** e adicione a variável:
   - `TRUEDY_API_KEY` = (sua chave secreta)
6. Pronto! Ele te dará uma URL (ex: `meu-proxy.onrender.com`).

---

## 🛠️ Como "colar" no seu site oficial

Se você já tem seu próprio HTML e quer apenas usar essa lógica:

1. No seu HTML, adicione o contêiner do botão:
   ```html
   <div id="voice-widget-container">
       <div id="captions"></div>
       <button id="voice-btn">🎙️ Falar com AI</button>
   </div>
   ```

2. Adicione o seu arquivo CSS (ou copie o conteúdo de `public/style.css`).
3. Importe o script no final do `<body>`:
   ```html
   <script type="module" src="https://sua-url-do-render.com/widget.js"></script>
   ```

4. No `widget.js`, mude a `const API_URL = '';` para `const API_URL = 'https://sua-url-do-render.com';`.

---

## 🔒 Por que esse servidor é necessário?
Se você colocar sua API Key diretamente no HTML/JS do seu site, **qualquer pessoa poderá roubá-la** e usar seus créditos da Truedy. Este servidor Express age como um "segurança", mantendo a chave escondida e apenas entregando a permissão de chamada para o navegador.
