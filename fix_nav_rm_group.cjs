const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const updatedServers = `
      {[
        { id: 'orbyn', name: 'Orbyn Official', img: null, icon: <Shield size={24} className="text-white" /> }
      ].map((server) => (
`;

content = content.replace(/\{\[\s*\{\s*id:\s*'orbyn'[\s\S]*?\}\)\}/, updatedServers.trim());
fs.writeFileSync('src/components/Navigation.tsx', content);
