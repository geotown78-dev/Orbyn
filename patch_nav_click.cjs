const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

code = code.replace(
    /\{voiceChannels\.map\(\(channel: any\) => \([\s\S]*?<\/div>\s*\)\)\}/,
    `{voiceChannels.map((channel: any) => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveVoiceChannel(channel.name)}
                  className={\`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative \${activeVoiceChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}\`}
                >
                  <Volume2 size={18} className={\`\${activeVoiceChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}\`} />
                  <span className="font-medium text-[15px]">{channel.name}</span>
                </div>
              ))}`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched click handler");
