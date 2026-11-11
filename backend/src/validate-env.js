// validate-env.js - Validação de variáveis de ambiente
const REQUIRED_ENV = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

const OPTIONAL_ENV = {
  PORT: '4000',
  NODE_ENV: 'development'
};

exports.validateEnv = () => {
  const missing = REQUIRED_ENV.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias ausentes:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }

  // Definir defaults para opcionais
  Object.entries(OPTIONAL_ENV).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      console.warn(`⚠️  ${key} não definido, usando default: ${defaultValue}`);
    }
  });

  console.log('✅ Variáveis de ambiente validadas');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT}`);
};