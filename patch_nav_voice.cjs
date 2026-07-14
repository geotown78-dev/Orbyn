const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

if (!code.includes("const [voiceStates, setVoiceStates] = useState")) {
   code = code.replace(
      /const \[isCreateChannelOpen, setIsCreateChannelOpen\] = useState\(false\);/,
      `const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);\n  const [voiceStates, setVoiceStates] = useState<Record<string, any[]>>({});\n  const presenceChannelRef = useRef<any>(null);`
   );
}

// Add useRef import if not there
if (!code.includes("useRef")) {
   code = code.replace(/import \{ useState, useEffect \} from "react";/, `import { useState, useEffect, useRef } from "react";`);
}

// Add MicOff icon to lucide-react imports if not there
if (!code.includes("MicOff")) {
   code = code.replace(/LogOut, Plus, Edit, Hash, Volume2/g, `LogOut, Plus, Edit, Hash, Volume2, MicOff`);
}

code = code.replace(
    /const \{[\s\S]*?friends\n\s*\} = useApp\(\);/,
    `const {\n    activeServer, setActiveServer,\n    activeChannel, setActiveChannel,\n    activeVoiceChannel, setActiveVoiceChannel,\n    user,\n    servers, setServers,\n    pendingRequestsCount,\n    friends,\n    isMuted\n  } = useApp();`
);


const presenceLogic = `
  useEffect(() => {
    if (activeServer !== '@me' && user) {
      const channel = supabase.channel(\`server_presence:\${activeServer}\`, {
        config: { presence: { key: user.id } }
      });
      presenceChannelRef.current = channel;

      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newVoiceStates: Record<string, any[]> = {};
        Object.values(state).forEach((presences: any) => {
          const p = presences[0];
          if (p && p.voiceChannel) {
             if (!newVoiceStates[p.voiceChannel]) newVoiceStates[p.voiceChannel] = [];
             newVoiceStates[p.voiceChannel].push(p);
          }
        });
        setVoiceStates(newVoiceStates);
      }).subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            user_name: user.name,
            avatar: user.avatar,
            voiceChannel: activeVoiceChannel,
            isMuted: isMuted
          });
        }
      });

      return () => {
        supabase.removeChannel(channel);
        presenceChannelRef.current = null;
      };
    }
  }, [activeServer, user]);

  useEffect(() => {
    if (presenceChannelRef.current && presenceChannelRef.current.state === 'joined' && user) {
       presenceChannelRef.current.track({
         user_id: user.id,
         user_name: user.name,
         avatar: user.avatar,
         voiceChannel: activeVoiceChannel,
         isMuted: isMuted
       });
    }
  }, [activeVoiceChannel, isMuted, user]);
`;

if (!code.includes("server_presence:")) {
   code = code.replace(/useEffect\(\(\) => \{\n\s*if \(\!user\) return;[\s\S]*?fetchChannels\(\);\n\s*\}, \[activeServer, user\]\);/, 
    (match) => match + "\n" + presenceLogic);
}

// Modify Voice channel rendering
code = code.replace(
    /\{voiceChannels\.map\(\(channel: any\) => \([\s\S]*?<\/div>\n\s*\)\)\}/,
    `{voiceChannels.map((channel: any) => (
                <div key={channel.id}>
                  <div 
                    onClick={() => setActiveVoiceChannel(channel.name)}
                    className={\`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative \${activeVoiceChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}\`}
                  >
                    <Volume2 size={18} className={\`\${activeVoiceChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}\`} />
                    <span className="font-medium text-[15px]">{channel.name}</span>
                  </div>
                  {voiceStates[channel.name] && voiceStates[channel.name].length > 0 && (
                    <div className="pl-8 pr-2 py-1 space-y-1">
                       {voiceStates[channel.name].map((u: any) => (
                          <div key={u.user_id} className="flex items-center justify-between group/user">
                             <div className="flex items-center gap-2">
                                <img src={u.avatar} className="w-6 h-6 rounded-full bg-[#13141C]" alt="" />
                                <span className="text-gray-400 font-medium text-[14px] group-hover/user:text-gray-300 truncate max-w-[120px]">{u.user_name}</span>
                             </div>
                             {u.isMuted && <MicOff size={14} className="text-red-400" />}
                          </div>
                       ))}
                    </div>
                  )}
                </div>
              ))}`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Navigation.tsx voice tracking");
