import fs from 'fs';

let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

content = content.replace("import { CreateChannelModal } from './CreateChannelModal';", "import { CreateChannelModal } from './CreateChannelModal';\nimport { InviteModal } from './InviteModal';");

content = content.replace("const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);", "const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);\n  const [isInviteOpen, setIsInviteOpen] = useState(false);");

content = content.replace(/<div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-\[#7038fa\] hover:bg-\[#7038fa\] hover:text-white rounded cursor-pointer transition-colors group">\s*<span>Invite People<\/span>\s*<UserPlus size={16} \/>\s*<\/div>/g, 
`<div 
  onClick={() => {
    setIsInviteOpen(true);
    setIsDropdownOpen(false);
  }}
  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors group"
>
  <span>Invite People</span>
  <UserPlus size={16} />
</div>`);

content = content.replace(/<div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-\[#7038fa\] hover:bg-\[#7038fa\] hover:text-white rounded cursor-pointer transition-colors">\s*<span>Invite Friends<\/span>\s*<UserPlus size={16} \/>\s*<\/div>/g, 
`<div 
  onClick={() => {
    setIsInviteOpen(true);
    setIsDropdownOpen(false);
  }}
  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors"
>
  <span>Invite Friends</span>
  <UserPlus size={16} />
</div>`);

content = content.replace(/<div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-\[#7038fa\] hover:text-white rounded cursor-pointer transition-colors">\s*<span>Edit Server Profile<\/span>\s*<Edit size={16} \/>\s*<\/div>/g, 
`<div 
  onClick={() => {
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
  }}
  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors"
>
  <span>Edit Server Profile</span>
  <Edit size={16} />
</div>`);

const renderString = `<CreateChannelModal
            isOpen={isCreateChannelOpen}
            onClose={() => setIsCreateChannelOpen(false)}
            serverId={currentServer.id}
          />`;
const renderStringWithInvite = `<CreateChannelModal
            isOpen={isCreateChannelOpen}
            onClose={() => setIsCreateChannelOpen(false)}
            serverId={currentServer.id}
          />

          <InviteModal
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            serverId={currentServer.id}
          />`;

content = content.replace(renderString, renderStringWithInvite);

fs.writeFileSync('src/components/Navigation.tsx', content);
console.log('Patched');
