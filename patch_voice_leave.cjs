const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceChannel.tsx', 'utf8');

if (!code.includes("const currentIds = usersInRoom.map")) {
    code = code.replace(
        /const usersInRoom = Object\.values\(state\)\.map\(\(p: any\) => p\[0\]\)\.filter\(Boolean\);/,
        `const usersInRoom = Object.values(state).map((p: any) => p[0]).filter(Boolean);
          const currentIds = usersInRoom.map((u: any) => u.user_id);
          
          setPeers(currentPeers => {
             // Cleanup connections for users who left
             currentPeers.forEach(p => {
                if (!currentIds.includes(p.id)) {
                   const pc = peerConnections.current.get(p.id);
                   if (pc) {
                      pc.close();
                      peerConnections.current.delete(p.id);
                      candidateQueue.current.delete(p.id);
                   }
                }
             });`
    );
}

fs.writeFileSync('src/components/VoiceChannel.tsx', code);
console.log("Patched VoiceChannel leave logic");
