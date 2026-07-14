const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

// import VoiceChannel
if (!content.includes('import { VoiceChannel }')) {
    content = content.replace("import { InviteModal } from './InviteModal';", "import { InviteModal } from './InviteModal';\nimport { VoiceChannel } from './VoiceChannel';");
}

// activeVoiceChannel
content = content.replace(
    "const { activeChannel, setActiveChannel, servers, setActiveServer } = useApp();",
    "const { activeChannel, setActiveChannel, activeVoiceChannel, setActiveVoiceChannel, servers, setActiveServer } = useApp();"
);

// fix voice channel onClick
content = content.replace(
    /onClick=\{\(\) => setActiveChannel\(channel.name\)\}\n\s*className=\{\`flex items-center gap-2 px-2 py-1\.5 rounded-lg cursor-pointer transition-colors group relative \$\{activeChannel === channel\.name \? 'bg-\\[#20212B\\] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-\\[#1A1B26\\]'\}\`\}\n\s*>\n\s*<Volume2 size=\{18\} className=\{\`\$\{activeChannel === channel\.name \? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'\}\`\} \/>/g,
    `onClick={() => setActiveVoiceChannel(channel.name)}\n                  className={\`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative \${activeVoiceChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}\`}\n                >\n                  <Volume2 size={18} className={\`\${activeVoiceChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}\`} />`
);

// render VoiceChannel at bottom
const renderPos = "{/* Server Settings Modal */";
content = content.replace(
    renderPos,
    "{activeVoiceChannel && <VoiceChannel channelId={activeVoiceChannel} channelName={activeVoiceChannel} />}\n      {/* Server Settings Modal */"
);

fs.writeFileSync('src/components/Navigation.tsx', content);
console.log("Patched Navigation.tsx");
