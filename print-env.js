import fs from 'fs';
try {
  const data = fs.readFileSync('.env', 'utf8');
  console.log(data.split('\n').filter(line => line.includes('SUPABASE')).join('\n'));
} catch (e) {
  console.log("No .env");
}
