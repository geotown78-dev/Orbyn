const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

code = code.replace(
    /!activeChannel\.startsWith\('dm_'\)/g,
    "!(activeChannel || '').startsWith('dm_')"
);

fs.writeFileSync('src/components/HomeView.tsx', code);
console.log("Patched HomeView");
