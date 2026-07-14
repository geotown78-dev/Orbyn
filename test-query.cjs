const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
let envFile = '';
try {
  envFile = fs.readFileSync('.env.example', 'utf8');
} catch (e) {
  envFile = fs.readFileSync('.env', 'utf8');
}
let url = process.env.VITE_SUPABASE_URL || '', key = process.env.VITE_SUPABASE_ANON_KEY || '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('server_members').select('role, servers(*)').limit(5);
  console.log("Check result:", JSON.stringify({ data, error }, null, 2));
}
check();
