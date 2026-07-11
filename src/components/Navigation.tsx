
import { Compass, Plus, Hash, Volume2, Shield } from 'lucide-react';
import { useApp } from '../AppContext';

export const ServerSidebar = () => {
  return (
    <div className="w-[72px] bg-[#0E0F15] flex flex-col items-center py-4 gap-3 shrink-0 border-r border-[#20212B]">
      <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(112,56,250,0.5)]">
         <span className="font-bold text-white text-xl">O</span>
      </div>
      
      <div className="w-8 h-[2px] bg-[#20212B] rounded-full my-1"></div>
      
      {[
        { id: 1, name: 'GameHub', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=100&h=100', active: true },
        { id: 2, name: 'Designers', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=100&h=100' },
        { id: 3, name: 'Study Group', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=100&h=100' },
      ].map((server) => (
        <div key={server.id} className="relative group flex items-center justify-center w-full">
          <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${server.active ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
          <div className={`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 ${server.active ? 'rounded-[16px] ring-2 ring-[#7038fa] ring-offset-2 ring-offset-[#0E0F15]' : ''}`}>
            <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}

      <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white mt-2">
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </div>
      <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white">
        <Compass size={24} />
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { activeChannel, setActiveChannel } = useApp();

  return (
    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
      {/* Server Header */}
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-4 justify-between cursor-pointer hover:bg-[#1A1B26] transition-colors">
        <h1 className="font-extrabold text-white text-[17px] tracking-wide">GameHub</h1>
        <Shield size={18} className="text-[#7038fa]" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Info Channels */}
        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer">
             <span className="w-3">▼</span> INFORMATION
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26] cursor-pointer transition-colors group">
              <Hash size={18} className="text-gray-500 group-hover:text-gray-400" />
              <span className="font-medium text-[15px]">announcements</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26] cursor-pointer transition-colors group">
              <Hash size={18} className="text-gray-500 group-hover:text-gray-400" />
              <span className="font-medium text-[15px]">rules</span>
            </div>
          </div>
        </div>

        {/* Text Channels */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer group">
             <div className="flex items-center gap-1"><span className="w-3">▼</span> TEXT CHANNELS</div>
             <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5">
            {['general', 'gaming-talk', 'memes', 'lfg'].map((channel) => (
              <div 
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${activeChannel === channel ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}`}
              >
                <Hash size={18} className={`${activeChannel === channel ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`} />
                <span className="font-medium text-[15px]">{channel}</span>
                {activeChannel !== channel && channel === 'memes' && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer group">
             <div className="flex items-center gap-1"><span className="w-3">▼</span> VOICE CHANNELS</div>
             <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26] cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-gray-500 group-hover:text-gray-400" />
                <span className="font-medium text-[15px]">Lobby</span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg bg-[#1A1B26] mt-1 p-1 pb-2">
              <div className="flex items-center justify-between px-2 py-1.5 rounded text-white cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Volume2 size={18} className="text-gray-300" />
                  <span className="font-medium text-[15px]">Gaming Room 1</span>
                </div>
              </div>
              <div className="pl-8 pr-2 pt-1 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nika" className="w-6 h-6 rounded-full bg-[#0E0F15]" alt="User" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Nika</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-[#1A1B26]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
