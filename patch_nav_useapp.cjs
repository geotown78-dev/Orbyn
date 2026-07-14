const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

code = code.replace(
    /const \{ activeServer, activeChannel, setActiveChannel, activeVoiceChannel, setActiveVoiceChannel, servers, setActiveServer \} = useApp\(\);/,
    `const { activeServer, activeChannel, setActiveChannel, activeVoiceChannel, setActiveVoiceChannel, servers, setActiveServer, user, isMuted } = useApp();`
);

fs.writeFileSync('src/components/Navigation.tsx', code);
console.log("Patched Sidebar useApp");
