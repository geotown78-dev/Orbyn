import fs from 'fs';

const content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const target = `    if (memberError) {
      console.error('Error adding member:', memberError);
      alert('Error adding member: ' + memberError.message);
      return;
    }`;

const insert = `
    // Add default channels
    const { error: channelsError } = await supabase.from('channels').insert([
      { id: \`text_\${Date.now()}\`, server_id: newId, name: 'general', type: 'text', category: 'text' },
      { id: \`text_\${Date.now()+1}\`, server_id: newId, name: 'gaming-talk', type: 'text', category: 'text' }
    ]);
    if (channelsError) {
      console.log('Could not add default channels (table might not exist yet):', channelsError);
    }
`;

if (content.includes(target)) {
    const newContent = content.replace(target, target + insert);
    fs.writeFileSync('src/components/Navigation.tsx', newContent);
    console.log('Patched');
} else {
    console.log('Target not found');
}
