// sanitizer.js - Sanitização HTML para prevenir XSS
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configuração: permite texto puro, remove apenas tags HTML perigosas
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [],        // Remove TODAS as tags HTML
  ALLOWED_ATTR: [],        // Remove TODOS os atributos
  KEEP_CONTENT: true       // IMPORTANTE: Mantém o conteúdo de texto dentro das tags removidas
};

exports.sanitize = (input) => {
  if (typeof input !== 'string') return input;
  return purify.sanitize(input, SANITIZE_CONFIG);
};

exports.sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = purify.sanitize(value, SANITIZE_CONFIG);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = exports.sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};