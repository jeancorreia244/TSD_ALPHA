// rateLimiter.js - Express rate limiting para segurança
const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { errors: [{ message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }] },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});

exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 cadastros por IP/hora
  message: { errors: [{ message: 'Muitos cadastros. Tente novamente em 1 hora.' }] }
});

exports.generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // 60 req/min
  message: { errors: [{ message: 'Muitas requisições. Aguarde um momento.' }] }
});