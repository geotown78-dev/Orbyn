const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const target = `const { error: channelsError } = await supabase.from('channels').insert([
      { id: \`text_\${Date.now()}\`, server_id: newId, name: 'general', type: 'text', category: 'text' },
      { id: \`text_\${Date.now()+1}\`, server_id: newId, name: 'gaming-talk', type: 'text', category: 'text' }
    ]);`;

const replacement = `const { error: channelsError } = await supabase.from('channels').insert([
      { id: \`text_\${Date.now()}\`, server_id: newId, name: 'announcements', type: 'text', category: 'info' },
      { id: \`text_\${Date.now()+1}\`, server_id: newId, name: 'rules', type: 'text', category: 'info' },
      { id: \`text_\${Date.now()+2}\`, server_id: newId, name: 'general', type: 'text', category: 'text' },
      { id: \`text_\${Date.now()+3}\`, server_id: newId, name: 'gaming-talk', type: 'text', category: 'text' },
      { id: \`text_\${Date.now()+4}\`, server_id: newId, name: 'memes', type: 'text', category: 'text' },
      { id: \`text_\${Date.now()+5}\`, server_id: newId, name: 'lfg', type: 'text', category: 'text' },
      { id: \`voice_\${Date.now()+6}\`, server_id: newId, name: 'General', type: 'voice', category: 'voice' }
    ]);`;

if (code.includes("name: 'general', type: 'text', category: 'text' },")) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/Navigation.tsx', code);
    console.log("Patched insertion");
} else {
    console.log("Target not found");
}
