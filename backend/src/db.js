// db.js - Cliente Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem ser definidos');
}

exports.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);