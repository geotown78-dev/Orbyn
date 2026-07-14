const fs = require('fs');
let code = fs.readFileSync('src/components/InviteModal.tsx', 'utf8');

code = code.replace(
    /\{copied \? 'Copied' : 'Copy'\}/g,
    `{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}`
);

fs.writeFileSync('src/components/InviteModal.tsx', code);
console.log("Patched InviteModal icons");
