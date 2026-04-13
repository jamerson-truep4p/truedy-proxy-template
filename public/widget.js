// ── Importando o SDK via CDN ( ESM.sh ) ──────────────────
// Isso evita a necessidade de instalar pacotes npm no frontend.
import { UltravoxSession } from 'https://esm.sh/ultravox-client';

// ── CONFIGURAÇÃO ────────────────────────────────────────
// Substitua pelo ID do seu Agente que você pegou no Dashboard da Truedy
const TRUEDY_AGENT_ID = 'ecc2d163-c121-41c7-9010-00eca3c18f25'; 

// URL do seu servidor Express (em desenvolvimento é localhost)
// Se você subir para o Render/Railway, esta URL mudará.
const API_URL = ''; // Vazio = mesmo domínio do servidor

let session = null;
const btn = document.getElementById('voice-btn');
const captions = document.getElementById('captions');

/**
 * Função principal para iniciar/parar a chamada
 */
async function toggleCall() {
  if (session) {
    await endCall();
    return;
  }
  await startCall();
}

async function startCall() {
  if (!TRUEDY_AGENT_ID || TRUEDY_AGENT_ID === 'YOUR_AGENT_UUID_HERE') {
    alert('Ops! Você esqueceu de configurar o TRUEDY_AGENT_ID no arquivo widget.js');
    return;
  }

  btn.innerHTML = '<span>⏳</span> Conectando...';
  btn.disabled = true;

  try {
    // 1. Solicita a joinUrl para o SEU servidor Express
    // Isso mantém sua API KEY segura no backend.
    const res = await fetch(`${API_URL}/api/start-voice-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        agentId: TRUEDY_AGENT_ID,
        variables: {
          customer_name: 'Usuário Web',
          page_url: window.location.href
        }
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.details || 'Erro ao iniciar chamada');
    }

    const { joinUrl, agentName } = await res.json();

    // 2. Inicializa a sessão com o SDK da Ultravox
    session = new UltravoxSession();

    // Escuta mudanças de status para atualizar o botão
    session.addEventListener('status', () => {
      updateUIStatus(session.status, agentName);
    });

    // Escuta as transcrições (legendas) em tempo real
    session.addEventListener('transcripts', () => {
      updateCaptions(session.transcripts);
    });

    // 3. Conecta o áudio
    await session.joinCall(joinUrl);
    
    btn.disabled = false;
    btn.classList.add('pulse');

  } catch (err) {
    console.error('Erro na chamada:', err);
    alert('Erro ao conectar: ' + err.message);
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
    connecting: '<span>⏳</span> Conectando...',
    idle: `<span>🟢</span> Online com ${agentName}`,
    listening: '<span>🎤</span> Ouvindo você...',
    thinking: '<span>💭</span> Pensando...',
    speaking: `<span>🤖</span> ${agentName} falando...`,
    disconnected: '<span>🔴</span> Chamada encerrada',
  };

  btn.innerHTML = statusLabels[status] || status;
  
  if (status === 'disconnected') {
    setTimeout(resetUI, 2000);
  }
}

function updateCaptions(transcripts) {
  if (transcripts && transcripts.length > 0) {
    captions.style.display = 'block';
    // Mostra as últimas 4 falas
    captions.innerHTML = transcripts
      .slice(-4)
      .map(t => `<div class="${t.speaker === 'agent' ? 'agent' : 'user'}">${t.speaker === 'agent' ? 'AI' : 'Você'}:</div><p>${t.text}</p>`)
      .join('');
    
    // Auto-scroll para o fim
    captions.scrollTop = captions.scrollHeight;
  }
}

function resetUI() {
  btn.innerHTML = '<span>🎙️</span> Falar com AI';
  btn.disabled = false;
  btn.classList.remove('pulse');
  captions.style.display = 'none';
  captions.innerHTML = '';
}

// Event Listeners
btn.addEventListener('click', toggleCall);
