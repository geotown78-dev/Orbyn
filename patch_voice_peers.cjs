const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceChannel.tsx', 'utf8');

code = code.replace(
    /setPeers\(currentPeers => \{\n\s*\/\/ Cleanup connections for users who left\n\s*currentPeers\.forEach\(p => \{\n\s*if \(\!currentIds\.includes\(p\.id\)\) \{\n\s*const pc = peerConnections\.current\.get\(p\.id\);\n\s*if \(pc\) \{\n\s*pc\.close\(\);\n\s*peerConnections\.current\.delete\(p\.id\);\n\s*candidateQueue\.current\.delete\(p\.id\);\n\s*\}\n\s*\}\n\s*\}\);\n\s*setPeers\(currentPeers => \{/,
    `setPeers(currentPeers => {
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
             });
             `
);

fs.writeFileSync('src/components/VoiceChannel.tsx', code);
console.log("Patched VoiceChannel peers syntax error");
