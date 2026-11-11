// validation.js - Schemas Joi para validação de inputs
const Joi = require('joi');

exports.schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(255).required().trim().messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().lowercase().trim().messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
    password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
      'string.min': 'Senha deve ter pelo menos 8 caracteres',
      'string.pattern.base': 'Senha deve conter: maiúscula, minúscula e número',
      'any.required': 'Senha é obrigatória'
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().allow('', null).messages({
      'string.pattern.base': 'Telefone inválido (formato: +5511999999999)'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  bible: Joi.object({
    book: Joi.string().min(1).max(100).required().trim(),
    chapter: Joi.number().integer().min(1).max(150).required(),
    verse: Joi.string().max(50).optional().allow('', null).trim(),
    notes: Joi.string().max(5000).optional().allow('', null).trim()
  }),

  prayer: Joi.object({
    focus: Joi.string().max(100).optional().allow('', null).trim(),
    note: Joi.string().max(5000).optional().allow('', null).trim(),
    duration: Joi.number().integer().min(1).max(86400).required()
  }),

  fasting: Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
    duration_hours: Joi.number().integer().min(1).max(720).optional().allow(null),
    notes: Joi.string().max(5000).optional().allow('', null).trim()
  }),

  devotional: Joi.object({
    reference: Joi.string().max(255).optional().allow('', null).trim(),
    title: Joi.string().max(255).optional().allow('', null).trim(),
    content: Joi.string().min(1).max(10000).required().trim(),
    date: Joi.date().iso().required()
  }),

  group: Joi.object({
    name: Joi.string().min(2).max(255).required().trim(),
    description: Joi.string().max(2000).optional().allow('', null).trim(),
    focus: Joi.string().max(255).optional().allow('', null).trim(),
    invite_code: Joi.string().pattern(/^G-[A-Z0-9]{6}$/).optional().allow('', null).trim()
  }),

  joinGroup: Joi.object({
    inviteCode: Joi.string().pattern(/^G-[A-Z0-9]{6}$/).required().uppercase().messages({
      'string.pattern.base': 'Código inválido. Formato: G-AB12CD'
    })
  })
};

exports.validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message).join('; ');
    throw new Error(messages);
  }
  return value;
};