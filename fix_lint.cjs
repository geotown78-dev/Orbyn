const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

content = content.replace("import { X, Link2 } from 'lucide-react';", "import { X } from 'lucide-react';");

content = content.replace("export const ServerSidebar = () => {", `export const ServerSidebar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateServer = (name: string) => {
    const newId = 'server_' + Date.now();
    const newServer = { id: newId, name, img: null, isOwner: true };
    setServers([...servers, newServer]);
    setActiveServer(newId);
  };

  const handleJoinServer = (link: string) => {
    const serverId = link.split('/').pop() || link;
    if (servers.find(s => s.id === serverId)) {
       setActiveServer(serverId);
       return;
    }
    const newServer = { id: serverId, name: 'Joined Server', img: null, isOwner: false };
    setServers([...servers, newServer]);
    setActiveServer(serverId);
  };
`);

// Now I need to remove the bad duplicate injection I did before in `ServerSidebar`.
// The previous script added:
// export const ServerSidebar = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// ...
// Let's just manually replace the first `export const ServerSidebar = () => {` completely, then remove the bad one. Wait, it's easier to just do it accurately.
