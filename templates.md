# 🎨 Truedy Voice AI — Button Templates

Copy and paste these templates into your website to get started immediately.

## Style A: Minimalist Round (Classic AI Mic)
A clean, breathing circular button designed for corners or floating layouts.

### 1. HTML
```html
<div id="tp-widget-container">
    <div id="captions"></div>
    <button id="voice-btn" title="Talk to AI">
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="3" width="10" height="16" rx="5" fill="url(#tpMicGrad)"/>
            <path d="M5.5 15.5C5.5 21.023 9.978 25.5 15.5 25.5C21.022 25.5 25.5 21.023 25.5 15.5" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
            <defs>
                <linearGradient id="tpMicGrad" x1="10" y1="3" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#4a9fe0"/><stop offset="100%" stop-color="#1a5fa8"/>
                </linearGradient>
            </defs>
        </svg>
    </button>
</div>
```

### 2. CSS
```css
#tp-widget-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
}

#voice-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: radial-gradient(circle at 35% 35%, #ffffff 0%, #ddeeff 55%, #b8d8f8 100%);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#voice-btn:hover { transform: scale(1.1); }
#voice-btn svg { width: 30px; height: 30px; }

/* Breathing pulse when active */
.pulse {
    animation: tp-pulse 2s infinite;
}

@keyframes tp-pulse {
    0% { box-shadow: 0 0 0 0 rgba(74, 159, 224, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(74, 159, 224, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 159, 224, 0); }
}

#captions {
    display: none;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom:  profile;
    max-width: 280px;
    font-size: 14px;
    border: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 12px;
}
```

---

## Style B: Premium Split-View (Wide Pill)
The interactive horizontal layout with integrated scrolling transcript.

### 1. HTML
```html
<div id="tp-pill-widget">
  <div class="tp-left">
    <button class="tp-btn" id="voice-btn">
      <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
        <rect x="10" y="3" width="10" height="16" rx="5" fill="url(#tpMicGrad)"/>
        <path d="M5.5 15.5C5.5 21.023 9.978 25.5 15.5 25.5" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <div class="tp-right" id="captions">
    <div class="tp-intro">Click to talk to Truedy™</div>
  </div>
</div>
```

### 2. CSS
```css
#tp-pill-widget {
    display: flex;
    align-items: center;
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 8px;
    width: 380px;
    height: 80px;
    position: fixed;
    bottom: 30px;
    right: 30px;
}

/* Add media queries for mobile */
@media (max-width: 600px) {
    #tp-pill-widget { width: 90%; right: 5%; bottom: 20px; }
}
```
