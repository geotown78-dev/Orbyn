const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const newServer = `
      {[
        { id: 'orbyn', name: 'Orbyn Official', img: null, icon: <Shield size={24} className="text-white" /> },
        { id: 'gamehub', name: 'GameHub', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=100&h=100' },
      ].map((server) => (
        <div key={server.id} className="relative group flex items-center justify-center w-full">
          <div className={\`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 \${activeServer === server.id ? 'h-10' : 'h-0 group-hover:h-5'}\`}></div>
          <div 
            onClick={() => setActiveServer(server.id)}
            className={\`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 \${activeServer === server.id ? 'rounded-[16px] ring-2 ring-[#7038fa] ring-offset-2 ring-offset-[#0E0F15] bg-[#7038fa]' : 'bg-[#1A1B26] hover:bg-[#7038fa]'}\`}
          >
            {server.img ? (
              <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              server.icon
            )}
          </div>
        </div>
      ))}
`;

content = content.replace(/\{\[\s*\{\s*id:\s*'gamehub'[\s\S]*?\}\)\}/, newServer.trim());

fs.writeFileSync('src/components/Navigation.tsx', content);
