const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    "{activeChannel.startsWith('dm_')",
    "{(activeChannel || '').startsWith('dm_')"
);
fs.writeFileSync('src/App.tsx', code);
