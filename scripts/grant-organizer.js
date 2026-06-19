#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env to use this script');
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error('Usage: node scripts/grant-organizer.js <user-id>');
  process.exit(1);
}

const userId = process.argv[2];

async function run() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('user_roles').insert([{ user_id: userId, role: 'organizer' }]);
  if (error) {
    console.error('Error granting role:', error);
    process.exit(1);
  }
  console.log('Granted organizer role to', userId);
}

run();
