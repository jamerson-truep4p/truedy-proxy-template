// =============================================
// Truedy Voice AI — Express Proxy Server
// =============================================
// This server acts as a secure proxy between your frontend
// and the Truedy API, keeping your API Key protected.
//
// Usage:
//   1. Copy .env.example → .env and fill in TRUEDY_API_KEY
//   2. Run: npm install && npm start
//   3. Frontend calls POST /api/start-voice-call
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS CONFIGURATION ──────────────────────────────────
// In production, restrict this to your actual website domains
const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';

if (allowedOrigins === '*') {
  app.use(cors());
} else {
  const origins = allowedOrigins.split(',').map(o => o.trim());
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests without origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS'));
    },
  }));
}

// ── MIDDLEWARE ──────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// ── HEALTH CHECK ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'truedy-voice-proxy',
  });
});

// ── START VOICE CALL ENDPOINT ───────────────────────────
// POST /api/start-voice-call
// Body: { agentId: string, variables?: object }
// Returns: { joinUrl: string, agentName: string }
app.post('/api/start-voice-call', async (req, res) => {
  try {
    // Validate API Key configuration
    const apiKey = process.env.TRUEDY_API_KEY;
    if (!apiKey || apiKey === 'YOUR_TRUEDY_API_KEY_HERE') {
      console.error('❌ TRUEDY_API_KEY not configured in .env');
      return res.status(500).json({
        error: 'Server not configured. Missing API Key.',
      });
    }

    // Extract data from request body
    const { agentId, variables } = req.body;

    if (!agentId) {
      return res.status(400).json({
        error: 'agentId is required in the request body.',
      });
    }

    console.log(`📞 Starting call for agent: ${agentId}`);

    // Call Truedy API
    const response = await fetch('https://api.truedy.ai/api/public/v1/webrtc/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        variables, // Optional — used to personalize agent prompts
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Truedy API error (${response.status}): ${errorText}`);
      return res.status(response.status).json({
        error: 'Failed to start call with Truedy.',
        details: response.status === 401
          ? 'Invalid API key. Verify TRUEDY_API_KEY in .env'
          : errorText,
      });
    }

    const data = await response.json();
    console.log(`✅ Call initialized! Agent: ${data.agentName}`);
    
    let joinUrl = data.joinUrl;
    
    // 🔥 HOTFIX: Corrects malformed URLs sometimes returned by the API (voice..ai -> voice.ultravox.ai)
    if (joinUrl && joinUrl.includes('voice..ai')) {
      console.log('⚠️ Malformed URL detected. Applying correction to voice.ultravox.ai');
      joinUrl = joinUrl.replace('voice..ai', 'voice.ultravox.ai');
    }

    console.log(`🔗 Join URL (final): ${joinUrl}`);

    res.json({
      joinUrl: joinUrl,
      agentName: data.agentName,
    });

  } catch (error) {
    console.error('❌ Internal Error:', error.message);
    res.status(500).json({
      error: 'Internal server error.',
      details: error.message,
    });
  }
});

// ── 404 HANDLER ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: {
      'GET /health': 'Health check',
      'POST /api/start-voice-call': 'Start voice call',
    },
  });
});

// ── START SERVER ────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🎙️  ═══════════════════════════════════════════');
  console.log('🎙️  Truedy Voice AI Proxy Server');
  console.log(`🎙️  Running at: http://localhost:${PORT}`);
  console.log(`🎙️  Health check: http://localhost:${PORT}/health`);
  console.log(`🎙️  Endpoint: POST http://localhost:${PORT}/api/start-voice-call`);
  console.log('🎙️  ═══════════════════════════════════════════');
  console.log('');

  // Warning if API Key is missing
  if (!process.env.TRUEDY_API_KEY || process.env.TRUEDY_API_KEY === 'YOUR_TRUEDY_API_KEY_HERE') {
    console.log('⚠️  WARNING: TRUEDY_API_KEY not configured!');
    console.log('⚠️  Edit your .env file and paste your API key.');
    console.log('');
  }
});
