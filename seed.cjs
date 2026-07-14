require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: servers } = await supabase.from('servers').select('*');
  if (!servers) return;
  for (const server of servers) {
    const { data: channels } = await supabase.from('channels').select('*').eq('server_id', server.id);
    if (!channels || channels.length < 3) {
      console.log('Seeding server:', server.name);
      await supabase.from('channels').insert([
        { id: `text_${Date.now()}_${server.id}_1`, server_id: server.id, name: 'announcements', type: 'text', category: 'info' },
        { id: `text_${Date.now()}_${server.id}_2`, server_id: server.id, name: 'rules', type: 'text', category: 'info' },
        { id: `text_${Date.now()}_${server.id}_3`, server_id: server.id, name: 'memes', type: 'text', category: 'text' },
        { id: `text_${Date.now()}_${server.id}_4`, server_id: server.id, name: 'lfg', type: 'text', category: 'text' },
      ]);
    }
  }
  console.log("Done");
}
run();
