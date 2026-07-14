import fs from 'fs';
const configs = ['.env', '.env.local', '.env.example'];
for (const file of configs) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    if (data.includes('VITE_SUPABASE_URL')) {
      console.log(`Found in ${file}`);
      const url = data.match(/VITE_SUPABASE_URL=(.*)/)[1];
      const key = data.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
      console.log(`URL: ${url}`);
      console.log(`KEY: ${key}`);
      break;
    }
  } catch (e) {}
}
