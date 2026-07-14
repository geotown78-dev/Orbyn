const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

code = code.replace(
    /const infoChannels = hasChannelsTable \? channels\.filter\(c => c\.category === 'info'\) : \[\{name: 'announcements'\}, \{name: 'rules'\}\];\n  const textChannels = hasChannelsTable \? channels\.filter\(c => c\.type === 'text' && c\.category !== 'info'\) : \[\{ name: 'general', type: 'text' \}, \{ name: 'gaming-talk', type: 'text' \}, \{ name: 'memes', type: 'text' \}, \{ name: 'lfg', type: 'text' \}\];\n  const voiceChannels = hasChannelsTable \? channels\.filter\(c => c\.type === 'voice'\) : \[\];/,
    `const infoChannelsFromDb = channels.filter(c => c.category === 'info');
  const textChannelsFromDb = channels.filter(c => c.type === 'text' && c.category !== 'info');
  const voiceChannelsFromDb = channels.filter(c => c.type === 'voice');

  const infoChannels = infoChannelsFromDb.length > 0 ? infoChannelsFromDb : [{name: 'announcements', type: 'text'}, {name: 'rules', type: 'text'}];
  const textChannels = textChannelsFromDb.length > 0 ? textChannelsFromDb : [{ name: 'general', type: 'text' }, { name: 'gaming-talk', type: 'text' }, { name: 'memes', type: 'text' }, { name: 'lfg', type: 'text' }];
  const voiceChannels = voiceChannelsFromDb.length > 0 ? voiceChannelsFromDb : [{ name: 'General', type: 'voice' }];`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Fallbacks");
