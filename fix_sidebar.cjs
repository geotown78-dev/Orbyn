const fs = require('fs');
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const updatedSidebar = `
export const Sidebar = () => {
  const { activeServer, activeChannel, setActiveChannel } = useApp();
  
  if (activeServer === 'orbyn') {
    return (
      <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
        <div className="h-[60px] border-b border-[#20212B] flex items-center px-4 justify-between cursor-pointer hover:bg-[#1A1B26] transition-colors">
          <h1 className="font-extrabold text-white text-[17px] tracking-wide">Orbyn Official</h1>
          <Shield size={18} className="text-[#7038fa]" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 text-sm">
           <Shield size={48} className="text-[#20212B] mb-4" />
           <p>This server is currently empty. Add channels to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
`;

content = content.replace('export const Sidebar = () => {\n  const { activeChannel, setActiveChannel } = useApp();\n  return (\n    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">', updatedSidebar.trim());

fs.writeFileSync('src/components/Navigation.tsx', content);
