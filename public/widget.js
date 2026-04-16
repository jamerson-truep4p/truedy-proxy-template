// ── Importing SDK via CDN (ESM.sh) ─────────────────────
// This avoids the need for local npm installation in the frontend.
import { UltravoxSession } from 'https://esm.sh/ultravox-client';

// ── CONFIGURATION ──────────────────────────────────────
// Replace with the Agent ID from your Truedy Dashboard
const TRUEDY_AGENT_ID = 'YOUR_AGENT_ID_HERE'; 

// URL of your Express server (localhost in development)
// This will change when you deploy to Render/Railway.
const API_URL = ''; // Empty = same domain as server

let session = null;
const btn      = document.getElementById('voice-btn');
const captions = document.getElementById('captions');

/**
 * Main function to start/stop the call
 */
async function toggleCall() {
  if (session) {
    await endCall();
    return;
  }
  await startCall();
}

async function startCall() {
  if (!TRUEDY_AGENT_ID || TRUEDY_AGENT_ID === 'YOUR_AGENT_ID_HERE') {
    alert('Oops! You forgot to configure TRUEDY_AGENT_ID in widget.js');
    return;
  }

  btn.innerHTML = '<span>⏳</span> Connecting...';
  btn.disabled = true;

  try {
    // 1. Request joinUrl from YOUR Express server
    // This keeps your API KEY secure on the backend.
    const res = await fetch(`${API_URL}/api/start-voice-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        agentId: TRUEDY_AGENT_ID,
        variables: {
          customer_name: 'Web User',
          page_url: window.location.href
        }
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.details || 'Error starting call');
    }

    const { joinUrl, agentName } = await res.json();

    // 2. Initialize session with Ultravox SDK
    session = new UltravoxSession();

    // Listen for status changes
    session.addEventListener('status', () => {
      updateUIStatus(session.status, agentName);
    });

    // Listen for real-time transcripts
    session.addEventListener('transcripts', () => {
      updateCaptions(session.transcripts);
    });

    // 3. Join the call
    await session.joinCall(joinUrl);
    
    btn.disabled = false;
    btn.classList.add('pulse');

  } catch (err) {
    console.error('Call Error:', err);
    alert('Failed to connect: ' + err.message);
    resetUI();
  }
}

async function endCall() {
  if (session) {
    await session.leaveCall();
    session = null;
    resetUI();
  }
}

function updateUIStatus(status, agentName) {
  const statusLabels = {
    connecting: '<span>⏳</span> Connecting...',
    idle: `<span>🟢</span> Online with ${agentName}`,
    listening: '<span>🎤</span> Listening...',
    thinking: '<span>💭</span> Thinking...',
    speaking: `<span>🤖</span> ${agentName} speaking...`,
    disconnected: '<span>🔴</span> Call ended',
  };

  btn.innerHTML = statusLabels[status] || status;
  
  if (status === 'disconnected') {
    setTimeout(resetUI, 2000);
  }
}

function updateCaptions(transcripts) {
  if (transcripts && transcripts.length > 0) {
    captions.style.display = 'block';
    // Show last 4 lines of transcript
    captions.innerHTML = transcripts
      .slice(-4)
      .map(t => `<div class="${t.speaker === 'agent' ? 'agent' : 'user'}">${t.speaker === 'agent' ? 'AI' : 'You'}:</div><p>${t.text}</p>`)
      .join('');
    
    // Auto-scroll to bottom
    captions.scrollTop = captions.scrollHeight;
  }
}

function resetUI() {
  btn.innerHTML = '<span>🎙️</span> Talk to AI';
  btn.disabled = false;
  btn.classList.remove('pulse');
  captions.style.display = 'none';
  captions.innerHTML = '';
}

// Event Listeners
btn.addEventListener('click', toggleCall);
