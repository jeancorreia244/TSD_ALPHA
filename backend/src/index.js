require('dotenv').config();
const { validateEnv } = require('./validate-env');
validateEnv();

const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');
const schemaModule = require('./schema');
const { generalLimiter, loginLimiter, registerLimiter } = require('./middleware/rateLimiter');
const { verifyToken } = require('./auth');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ];

    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/graphql', generalLimiter);

// Middleware para aplicar rate limiting específico baseado na operação GraphQL
const graphqlRateLimiter = (req, res, next) => {
  const body = req.body;
  if (body && body.query) {
    // Detectar operações de login
    if (body.query.includes('mutation Login') || body.query.includes('mutation login')) {
      return loginLimiter(req, res, next);
    }
    // Detectar operações de register
    if (body.query.includes('mutation Register') || body.query.includes('mutation register')) {
      return registerLimiter(req, res, next);
    }
  }
  next();
};

app.use('/graphql', graphqlRateLimiter);

const handler = createHandler({
  schema: schemaModule,
  rootValue: schemaModule.root,
  context: async (req) => {
    const headers = req.headers || req.raw?.headers || {};
    const authHeader = headers.authorization || headers.Authorization || '';
    const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    let token = null;
    let user = null;

    if (authValue && typeof authValue === 'string') {
      token = authValue.startsWith('Bearer ')
        ? authValue.slice(7).trim()
        : authValue.trim();
      user = verifyToken(token);
    }

    return { token, user };
  }
});

app.all('/graphql', handler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL rodando em http://localhost:${PORT}/graphql`);
    console.log(`   Ambiente: ${process.env.NODE_ENV}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;