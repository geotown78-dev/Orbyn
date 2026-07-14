const fs = require('fs');
let content = fs.readFileSync('src/AppContext.tsx', 'utf8');

content = content.replace("const [activeServer, setActiveServer] = useState('@me');", "const [activeServer, setActiveServer] = useState('orbyn');");

fs.writeFileSync('src/AppContext.tsx', content);
