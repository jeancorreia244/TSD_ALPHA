// auth.js - Autenticação JWT segura
const jwt = require('jsonwebtoken');
const { supabase } = require('./db');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET deve ser definido nas variáveis de ambiente');
}

const JWT_EXPIRES_IN = '7d';

exports.signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

exports.getUserFromToken = async (token) => {
  if (!token) return null;

  const decoded = exports.verifyToken(token);
  if (!decoded) return null;

  // 🔒 SEGURANÇA: Select EXPLÍCITO - NUNCA *
  const { data, error } = await supabase
    .from('Users')
    .select('id, name, email, phone, created_at')
    .eq('id', decoded.id)
    .single();

  if (error || !data) return null;
  return data;
};

exports.hashPassword = async (password) => {
  return bcrypt.hash(password, 12); // Cost 12 = mais seguro
};

exports.comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};