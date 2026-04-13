// =============================================
// Truedy Voice AI — Express Proxy Server
// =============================================
// Este servidor atua como proxy seguro entre o frontend
// e a API da Truedy, protegendo sua API key.
//
// Uso:
//   1. Copie .env.example → .env e preencha TRUEDY_API_KEY
//   2. npm start
//   3. Frontend chama POST /api/start-voice-call
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ────────────────────────────────────────────────
// Em produção, restrinja para os domínios do seu site
const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';

if (allowedOrigins === '*') {
  app.use(cors());
} else {
  const origins = allowedOrigins.split(',').map(o => o.trim());
  app.use(cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (ex: curl, Postman)
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Bloqueado pelo CORS'));
    },
  }));
}

// ── Body parser ─────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// ── Health check ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'truedy-voice-proxy',
  });
});

// ── Start Voice Call ────────────────────────────────────
// POST /api/start-voice-call
// Body: { agentId: string, variables?: object }
// Returns: { joinUrl: string, agentName: string }
app.post('/api/start-voice-call', async (req, res) => {
  try {
    // Valida se a API key está configurada
    const apiKey = process.env.TRUEDY_API_KEY;
    if (!apiKey || apiKey === 'YOUR_TRUEDY_API_KEY_HERE') {
      console.error('❌ TRUEDY_API_KEY não configurada no .env');
      return res.status(500).json({
        error: 'Servidor não configurado. API key ausente.',
      });
    }

    // Extrai dados do body
    const { agentId, variables } = req.body;

    if (!agentId) {
      return res.status(400).json({
        error: 'agentId é obrigatório no body da requisição.',
      });
    }

    console.log(`📞 Iniciando chamada para agente: ${agentId}`);

    // Chama a API da Truedy
    const response = await fetch('https://api.truedy.ai/api/public/v1/webrtc/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        variables, // opcional — personaliza o prompt do agente
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Truedy API error (${response.status}): ${errorText}`);
      return res.status(response.status).json({
        error: 'Falha ao iniciar chamada com a Truedy.',
        details: response.status === 401
          ? 'API key inválida. Verifique TRUEDY_API_KEY no .env'
          : errorText,
      });
    }

    const data = await response.json();
    console.log(`✅ Chamada iniciada! Agent: ${data.agentName}`);
    console.log(`🔗 Join URL: ${data.joinUrl}`);


    // Retorna APENAS joinUrl + agentName — NUNCA exponha a API key
    res.json({
      joinUrl: data.joinUrl,
      agentName: data.agentName,
    });

  } catch (error) {
    console.error('❌ Erro interno:', error.message);
    res.status(500).json({
      error: 'Erro interno do servidor.',
      details: error.message,
    });
  }
});

// ── 404 handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    availableRoutes: {
      'GET /health': 'Health check',
      'POST /api/start-voice-call': 'Iniciar chamada de voz',
    },
  });
});

// ── Start server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🎙️  ═══════════════════════════════════════════');
  console.log('🎙️  Truedy Voice AI Proxy Server');
  console.log(`🎙️  Rodando em: http://localhost:${PORT}`);
  console.log(`🎙️  Health check: http://localhost:${PORT}/health`);
  console.log(`🎙️  Endpoint: POST http://localhost:${PORT}/api/start-voice-call`);
  console.log('🎙️  ═══════════════════════════════════════════');
  console.log('');

  // Avisa se a API key não foi configurada
  if (!process.env.TRUEDY_API_KEY || process.env.TRUEDY_API_KEY === 'YOUR_TRUEDY_API_KEY_HERE') {
    console.log('⚠️  ATENÇÃO: TRUEDY_API_KEY não configurada!');
    console.log('⚠️  Edite o arquivo .env e cole sua API key.');
    console.log('');
  }
});
