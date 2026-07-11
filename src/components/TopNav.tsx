
import { Minus, Square, X, Search, Bell, Settings } from 'lucide-react';
import { useApp } from '../AppContext';

export const TopNav = () => {
  const { setSettingsOpen } = useApp();
  
  return (
    <div className="h-[60px] flex items-center justify-between px-4 bg-[#0E0F15] border-b border-[#20212B] flex-shrink-0 select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 w-[260px] pl-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7038fa] to-[#4b1fc4] flex items-center justify-center shadow-[0_0_15px_rgba(112,56,250,0.5)]">
           <span className="font-bold text-white text-lg">O</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Orbyn</span>
      </div>
      
      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-[500px]">
          <Search size={16} className="absolute left-4 top-2.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search communities, chats, or friends..."
            className="w-full bg-[#181922] border border-[#20212B] rounded-full py-2 pl-11 pr-4 text-sm text-gray-200 focus:outline-none focus:border-[#7038fa]/50 transition-colors placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-5 pr-2">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="relative cursor-pointer hover:text-white transition-colors">
             <Bell size={20} />
             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0E0F15]"></div>
          </div>
          <Settings 
            size={20} 
            className="cursor-pointer hover:text-white transition-colors" 
            onClick={() => setSettingsOpen(true)}
          />
        </div>
        
        <div className="flex items-center gap-3 ml-6 text-gray-500">
          <Minus size={18} className="hover:text-white cursor-pointer transition-colors" />
          <Square size={14} className="hover:text-white cursor-pointer transition-colors" />
          <X size={20} className="hover:text-red-500 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};
