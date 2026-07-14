const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

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
   code = code.replace(/  const \[channels, setChannels\] = useState<any\[\]>\(\[\]\);/, 
    (match) => presenceLogic + "\n" + match);
}

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Navigation.tsx presence logic");
