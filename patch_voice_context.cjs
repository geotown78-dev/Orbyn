const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceChannel.tsx', 'utf8');

code = code.replace(
    /const \{ user, activeServer, setActiveVoiceChannel \} = useApp\(\);/,
    `const { user, activeServer, setActiveVoiceChannel, isMuted, setIsMuted } = useApp();`
);

code = code.replace(
    /const \[isMuted, setIsMuted\] = useState\(false\);/,
    ``
);

code = code.replace(
    /localStream\.current\.getAudioTracks\(\)\.forEach\(track => \{\n\s*track\.enabled = \!nextMute;\n\s*\}\);/,
    `// Wait, we need to do this when isMuted changes generally. 
    // We can use a useEffect to sync stream state with isMuted
    `
);

fs.writeFileSync('src/components/VoiceChannel.tsx', code);
console.log("Patched VoiceChannel context");
