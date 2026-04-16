# 🎙️ Truedy Voice AI — Proxy Template

A secure, production-ready Express proxy server to integrate **Truedy.ai** voice agents into any website while keeping your API Key safe.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jamerson-truep4p/truedy-proxy-template)

---

## 🌟 Features
- **Secure Architecture**: Hides your Truedy API Key on the server-side.
- **One-Click Deploy**: Fully configured for [Render.com](https://render.com).
- **Responsive Captions**: Real-time transcriptions for your voice calls.
- **Premium Templates**: Includes beautiful, ready-to-use button designs.
- **CORS Ready**: Configurable access to protect your endpoint.

---

## 🚀 Speed Run (Deploy in 2 Minutes)

### Step 1: Deploy the Server
1. Click the **"Deploy to Render"** button above.
2. Under **Environment Variables**, paste your `TRUEDY_API_KEY` (get it from the [Truedy Dashboard](https://dashboard.truedy.ai)).
3. Click **Deploy**. Once finished, copy your service URL (e.g., `https://my-proxy.onrender.com`).

### Step 2: Configure the Widget
1. In this repository, open `public/widget.js`.
2. Replace `YOUR_AGENT_ID_HERE` with your Agent ID.
3. Replace the `API_URL` with your Render URL from Step 1 (only necessary if hosting the widget on a DIFFERENT domain).

### Step 3: Add to Your Site
Choose a design from our **[Templates Collection](templates.md)** and copy the HTML/CSS into your website. Link the script:
```html
<script type="module" src="https://YOUR-PROXY-URL.onrender.com/widget.js"></script>
```

---

## 🛠️ Local Development
1. Clone the repo: `git clone https://github.com/your-username/truedy-proxy-template.git`
2. Install dependencies: `npm install`
3. Setup Environment: Rename `.env.example` to `.env` and add your key.
4. Start: `npm run dev`
5. Test: Open `http://localhost:3000` in your browser.

---

## 🔒 Why use a Proxy?
If you put your Truedy API Key directly in your frontend code, **anyone can steal it** and use your credits. This proxy acts as a secure "guard", keeping your credentials safe while only providing a temporary authorization to the user's browser for the call.

---

## 🤝 Contributing & Support
This is a community template. For issues with the Truedy API, please visit [docs.truedy.ai](https://docs.truedy.ai).

Created with ❤️ by the **[Truedy Team](https://truedy.ai)**
