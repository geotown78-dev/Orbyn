const fs = require('fs');
let code = fs.readFileSync('src/components/ServerInviteCard.tsx', 'utf8');

code = code.replace(
    /const { user, servers, setActiveServer } = useApp\(\);/,
    `const { user, servers, setActiveServer, setActiveChannel } = useApp();`
);

code = code.replace(
    /setActiveServer\(serverId\);/g,
    `setActiveServer(serverId);\n        setActiveChannel('general');`
);

fs.writeFileSync('src/components/ServerInviteCard.tsx', code);
console.log("Patched ServerInviteCard setActiveChannel");
