const fs = require('fs');
let code = fs.readFileSync('src/components/ServerInviteCard.tsx', 'utf8');

code = code.replace(
    /className="absolute -top-\[30px\]"/,
    'className="absolute -top-[30px] left-4"'
);

fs.writeFileSync('src/components/ServerInviteCard.tsx', code);
console.log("Patched ServerInviteCard positioning");
