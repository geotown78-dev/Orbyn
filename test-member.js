import fs from 'fs';
let envFile = '';
try { envFile = fs.readFileSync('.env.example', 'utf8'); } catch (e) { envFile = fs.readFileSync('.env', 'utf8'); }
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
});

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('server_members').select('role, servers(*)');
  console.log("Error:", error);
  console.log("Data:", data);
}
run();
