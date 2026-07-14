const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

code = code.replace(
    /const textChannels = hasChannelsTable \? channels\.filter\(c => c\.type === 'text'\) : \[\{ name: 'general', type: 'text' \}, \{ name: 'gaming-talk', type: 'text' \}, \{ name: 'memes', type: 'text' \}, \{ name: 'lfg', type: 'text' \}\];/,
    `const infoChannels = hasChannelsTable ? channels.filter(c => c.category === 'info') : [{name: 'announcements'}, {name: 'rules'}];\n  const textChannels = hasChannelsTable ? channels.filter(c => c.type === 'text' && c.category !== 'info') : [{ name: 'general', type: 'text' }, { name: 'gaming-talk', type: 'text' }, { name: 'memes', type: 'text' }, { name: 'lfg', type: 'text' }];`
);

code = code.replace(
    /\{\/\* Info Channels \*\/\}[\s\S]*?\{!hasChannelsTable && \(/,
    `{/* Info Channels */}\n        {(infoChannels.length > 0 || !hasChannelsTable) && (`
);

code = code.replace(
    /<div className="space-y-0\.5">\s*<div\s*onClick=\{\(\) => setActiveChannel\('announcements'\)\}\s*className=\{`flex items-center gap-2 px-2 py-1\.5 rounded-lg cursor-pointer transition-colors group relative \$\{activeChannel === 'announcements' \? 'bg-\\[#20212B\\] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-\\[#1A1B26\\]'\}`\}\s*>\s*<Hash size=\{18\} className=\{`\$\{activeChannel === 'announcements' \? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'\}`\} \/>\s*<span className="font-medium text-\\[15px\\]">announcements<\/span>\s*<\/div>\s*<div\s*onClick=\{\(\) => setActiveChannel\('rules'\)\}\s*className=\{`flex items-center gap-2 px-2 py-1\.5 rounded-lg cursor-pointer transition-colors group relative \$\{activeChannel === 'rules' \? 'bg-\\[#20212B\\] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-\\[#1A1B26\\]'\}`\}\s*>\s*<Hash size=\{18\} className=\{`\$\{activeChannel === 'rules' \? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'\}`\} \/>\s*<span className="font-medium text-\\[15px\\]">rules<\/span>\s*<\/div>\s*<\/div>/,
    `<div className="space-y-0.5">
            {infoChannels.map((channel: any) => (
              <div 
                key={channel.id || channel.name}
                onClick={() => setActiveChannel(channel.name)}
                className={\`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative \${activeChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}\`}
              >
                <Hash size={18} className={\`\${activeChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}\`} />
                <span className="font-medium text-[15px]">{channel.name}</span>
              </div>
            ))}
          </div>`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Categories");
