# 🎨 Truedy Voice AI — Stand-alone Button Templates

These templates are **self-contained**. Simply copy the **entire block** and paste it into your website's "Code Widget" or "HTML Element" (Elementor, Wix, Webflow, etc.).

---

## 🟢 Style A: Minimalist Round (Classic)
A clean circular float button with a breathing pulse effect. Perfect for corners.

```html
<!-- TRUEDY VOICE WIDGET: MINIMALIST ROUND -->
<style>
  /* --- 1. SETTINGS & COLORS --- */
  :root {
    --tp-btn-size: 64px;
    --tp-primary-color: #1a5fa8;   /* EDIT: Your branding color */
    --tp-secondary-color: #4a9fe0; /* EDIT: Your pulse color */
    --tp-text-color: #ffffff;      /* EDIT: Caption text color */
  }

  #tp-widget-a {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
    z-index: 99999;
  }

  #tp-btn-a {
    width: var(--tp-btn-size);
    height: var(--tp-btn-size);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: radial-gradient(circle at 35% 35%, #ffffff 0%, #ddeeff 55%, #b8d8f8 100%);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    outline: none;
  }
  #tp-btn-a:hover { transform: scale(1.08); }
  #tp-btn-a.active { animation: tp-pulse-a 2s infinite; }

  @keyframes tp-pulse-a {
    0% { box-shadow: 0 0 0 0 rgba(74, 159, 224, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(74, 159, 224, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 159, 224, 0); }
  }

  #tp-caps-a {
    display: none;
    background: rgba(15, 23, 42, 0.9);
    color: var(--tp-text-color);
    padding: 12px;
    border-radius: 12px;
    font-size: 13px;
    margin-bottom: 12px;
    max-width: 260px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
  }
</style>

<div id="tp-widget-a">
  <div id="tp-caps-a"></div>
  <button id="tp-btn-a" title="Talk to AI">
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
      <rect x="10" y="3" width="10" height="16" rx="5" fill="url(#gradA)"/>
      <path d="M5.5 15.5C5.5 21.023 9.978 25.5 15.5 25.5" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
      <defs><linearGradient id="gradA" x1="10" y1="3" x2="20" y2="19"><stop offset="0%" stop-color="#4a9fe0"/><stop offset="100%" stop-color="#1a5fa8"/></linearGradient></defs>
    </svg>
  </button>
</div>

<script type="module">
  import { UltravoxSession } from 'https://esm.sh/ultravox-client';

  /* --- 2. CONFIGURATION --- */
  const AGENT_ID = 'YOUR_AGENT_ID_HERE';          // EDIT: Your Agent ID
  const PROXY_URL = 'https://YOUR-PROXY.render.com'; // EDIT: Your Proxy URL

  let session = null;
  const btn = document.getElementById('tp-btn-a');
  const caps = document.getElementById('tp-caps-a');

  btn.onclick = async () => {
    if (session) { await session.leaveCall(); session = null; btn.classList.remove('active'); caps.style.display = 'none'; return; }
    
    btn.disabled = true;
    try {
      const res = await fetch(`${PROXY_URL}/api/start-voice-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: AGENT_ID })
      });
      const { joinUrl } = await res.json();
      const finalUrl = joinUrl.replace('voice..ai', 'voice.ultravox.ai'); // Hotfix

      session = new UltravoxSession();
      session.addEventListener('status', () => { if (session.status === 'speaking' || session.status === 'listening') btn.classList.add('active'); });
      session.addEventListener('transcripts', () => { 
        caps.style.display = 'block';
        caps.innerHTML = session.transcripts.slice(-2).map(t => `<p><b>${t.speaker === 'agent' ? 'Truedy' : 'You'}:</b> ${t.text}</p>`).join('');
      });

      await session.joinCall(finalUrl);
      btn.disabled = false;
    } catch (e) { alert('Connect failed'); btn.disabled = false; }
  };
</script>
```

---

## 🔵 Style B: Premium Split-View (Pill)
A sophisticated wide layout with fixed-height scrolling transcription.

```html
<!-- TRUEDY VOICE WIDGET: PREMIUM PILL -->
<style>
  /* --- 1. SETTINGS & COLORS --- */
  #tp-pill-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 8px;
    width: 400px; /* Fixed Desktop Width */
    height: 84px;  /* Fixed Height */
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 99999;
    font-family: sans-serif;
    box-sizing: border-box;
  }

  @media (max-width: 500px) {
    #tp-pill-box { width: 90%; right: 5%; bottom: 20px; }
  }

  #tp-btn-b {
    width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
    background: radial-gradient(circle at 35% 35%, #ffffff 0%, #ddeeff 55%, #b8d8f8 100%);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
  }

  .tp-transcripts {
    flex: 1; height: 60px; margin-left: 12px; overflow-y: auto;
    font-size: 13px; color: white; line-height: 1.4;
  }
  .tp-transcripts b { color: #a5c8f8; }
</style>

<div id="tp-pill-box">
  <button id="tp-btn-b">
    <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
      <rect x="10" y="3" width="10" height="16" rx="5" fill="url(#gradB)"/>
      <path d="M5.5 15.5C5.5 21.023 9.978 25.5 15.5 25.5" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <defs><linearGradient id="gradB" x1="10" y1="3" x2="20" y2="19"><stop offset="0%" stop-color="#4a9fe0"/><stop offset="100%" stop-color="#1a5fa8"/></linearGradient></defs>
    </svg>
  </button>
  <div class="tp-transcripts" id="tp-caps-b">
    <div style="opacity: 0.6; italic">Click to start AI demo...</div>
  </div>
</div>

<script type="module">
  import { UltravoxSession } from 'https://esm.sh/ultravox-client';

  /* --- 2. CONFIGURATION --- */
  const AGENT_ID = 'YOUR_AGENT_ID_HERE';          // EDIT HERE
  const PROXY_URL = 'https://YOUR-PROXY.render.com'; // EDIT HERE

  let session = null;
  const btn = document.getElementById('tp-btn-b');
  const caps = document.getElementById('tp-caps-b');

  btn.onclick = async () => {
    if (session) { await session.leaveCall(); session = null; return; }
    btn.disabled = true;
    try {
      const res = await fetch(`${PROXY_URL}/api/start-voice-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: AGENT_ID })
      });
      const { joinUrl } = await res.json();
      session = new UltravoxSession();
      session.addEventListener('transcripts', () => {
        caps.innerHTML = session.transcripts.map(t => `<div style="margin-bottom:8px"><b>${t.speaker === 'agent' ? 'Truedy' : 'You'}:</b> ${t.text}</div>`).join('');
        caps.scrollTop = caps.scrollHeight;
      });
      await session.joinCall(joinUrl.replace('voice..ai', 'voice.ultravox.ai'));
      btn.disabled = false;
    } catch (e) { alert('Check config'); btn.disabled = false; }
  };
</script>
```
