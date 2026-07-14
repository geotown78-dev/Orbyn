import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

let envFile = '';
try { envFile = fs.readFileSync('.env.example', 'utf8'); } catch (e) { envFile = fs.readFileSync('.env', 'utf8'); }
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
});

const supabase = createClient(url, key);

async function run() {
  const { data: servers, error: err1 } = await supabase.from('servers').select('*');
  console.log("Servers:", servers, err1);
  const { data: members, error: err2 } = await supabase.from('server_members').select('*');
  console.log("Members:", members, err2);
  const { data: userSettings, error: err3 } = await supabase.from('user_settings').select('*');
  console.log("UserSettings:", userSettings, err3);
}
run();
