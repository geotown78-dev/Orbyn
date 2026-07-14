const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const modalCode = `
import { X, Link2 } from 'lucide-react';

const AddServerModal = ({ isOpen, onClose, onCreate, onJoin }: any) => {
  const [view, setView] = useState<'options' | 'create' | 'join'>('options');
  const [serverName, setServerName] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (serverName.trim()) {
      onCreate(serverName.trim());
      setServerName('');
      setView('options');
      onClose();
    }
  };

  const handleJoin = () => {
    if (inviteLink.trim()) {
      onJoin(inviteLink.trim());
      setInviteLink('');
      setView('options');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#111218] rounded-xl w-full max-w-md border border-[#20212B] shadow-2xl relative flex flex-col max-h-full overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={() => { onClose(); setView('options'); }} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {view === 'options' && (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Create a server</h2>
            <p className="text-gray-400 mb-8">Your server is where you and your friends hang out. Make yours and start talking.</p>
            
            <button onClick={() => setView('create')} className="w-full flex items-center gap-3 p-4 bg-[#1A1B26] hover:bg-[#20212B] border border-[#20212B] rounded-lg mb-4 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#7038fa] flex items-center justify-center text-white shrink-0">
                <Plus size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-bold text-[17px] group-hover:text-[#7038fa] transition-colors">Create My Own</div>
              </div>
              <div className="text-gray-500">▶</div>
            </button>

            <div className="bg-[#1A1B26] p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Have an invite already?</h3>
              <button onClick={() => setView('join')} className="w-full bg-[#4e5058] hover:bg-[#5c5e66] text-white font-medium py-2 rounded transition-colors">
                Join a Server
              </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Customize your server</h2>
            <p className="text-gray-400 mb-8 text-center text-sm">Give your new server a personality with a name and an icon. You can always change it later.</p>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2 block">Server Name</label>
              <input 
                type="text" 
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full bg-[#1e1f22] text-white p-3 rounded border border-transparent focus:border-[#7038fa] outline-none transition-colors"
                placeholder="My Awesome Server"
              />
            </div>
            
            <div className="flex justify-between items-center bg-[#1A1B26] -mx-8 -mb-8 p-4 mt-8">
              <button onClick={() => setView('options')} className="text-white text-sm hover:underline">Back</button>
              <button onClick={handleCreate} disabled={!serverName.trim()} className="bg-[#7038fa] hover:bg-[#5b2bd1] disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Join a Server</h2>
            <p className="text-gray-400 mb-8 text-center text-sm">Enter an invite below to join an existing server.</p>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2 block">Invite Link *</label>
              <input 
                type="text" 
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                className="w-full bg-[#1e1f22] text-white p-3 rounded border border-transparent focus:border-[#7038fa] outline-none transition-colors"
                placeholder="https://orbyn.gg/..."
              />
            </div>
            
            <div className="flex justify-between items-center bg-[#1A1B26] -mx-8 -mb-8 p-4 mt-8">
              <button onClick={() => setView('options')} className="text-white text-sm hover:underline">Back</button>
              <button onClick={handleJoin} disabled={!inviteLink.trim()} className="bg-[#7038fa] hover:bg-[#5b2bd1] disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors">
                Join Server
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`;

content = content.replace("export const ServerSidebar = () => {", modalCode + "\nexport const ServerSidebar = () => {\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n\n  const handleCreateServer = (name: string) => {\n    const newId = 'server_' + Date.now();\n    const newServer = { id: newId, name, img: null, isOwner: true };\n    setServers([...servers, newServer]);\n    setActiveServer(newId);\n  };\n\n  const handleJoinServer = (link: string) => {\n    // Simple mock logic for now, extracts anything after last /\n    const serverId = link.split('/').pop() || link;\n    if (servers.find(s => s.id === serverId)) {\n       setActiveServer(serverId);\n       return;\n    }\n    const newServer = { id: serverId, name: 'Joined Server', img: null, isOwner: false };\n    setServers([...servers, newServer]);\n    setActiveServer(serverId);\n  };\n");

content = content.replace(
  `<div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white mt-2">`,
  `<div onClick={() => setIsAddModalOpen(true)} className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white mt-2">`
);

content = content.replace(
  `    </div>\n  );\n};`,
  `      <AddServerModal \n        isOpen={isAddModalOpen}\n        onClose={() => setIsAddModalOpen(false)}\n        onCreate={handleCreateServer}\n        onJoin={handleJoinServer}\n      />\n    </div>\n  );\n};`
);

fs.writeFileSync('src/components/Navigation.tsx', content);
