
import { Compass, Plus, Hash, Volume2, Shield, Settings, UserPlus, LogOut, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../AppContext';

export const ServerSidebar = () => {
  const { activeServer, setActiveServer, servers } = useApp();

  return (
    <div className="w-[72px] bg-[#0E0F15] flex flex-col items-center py-4 gap-3 shrink-0 border-r border-[#20212B]">
      {/* Home / Direct Messages */}
      <div className="relative group flex items-center justify-center w-full">
        <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${activeServer === '@me' ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
        <div 
          onClick={() => setActiveServer('@me')}
          className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(112,56,250,0.5)] ${activeServer === '@me' ? 'rounded-[16px]' : ''}`}
        >
           <span className="font-bold text-white text-xl">O</span>
        </div>
      </div>
      
      <div className="w-8 h-[2px] bg-[#20212B] rounded-full my-1"></div>

      {servers.map((server) => (
        <div key={server.id} className="relative group flex items-center justify-center w-full">
          <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${activeServer === server.id ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
          <div 
            onClick={() => setActiveServer(server.id)}
            className={`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#1A1B26] overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center ${activeServer === server.id ? 'rounded-[16px] ring-2 ring-[#7038fa] ring-offset-2 ring-offset-[#0E0F15]' : ''}`}
          >
            {server.img ? (
              <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              <Shield size={24} className="text-white" />
            )}
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
  const { activeChannel, setActiveChannel, activeServer, servers, setServers, setActiveServer: switchServer } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentServer = servers.find(s => s.id === activeServer);
  
  if (!currentServer && activeServer !== '@me') {
    return null;
  }

  const handleLeaveServer = () => {
    const updatedServers = servers.filter(s => s.id !== activeServer);
    setServers(updatedServers);
    switchServer('@me');
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
      {/* Server Header */}
      {activeServer !== '@me' && currentServer && (
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`h-[60px] border-b border-[#20212B] flex items-center px-4 justify-between cursor-pointer transition-colors ${isDropdownOpen ? 'bg-[#1A1B26]' : 'hover:bg-[#1A1B26]'}`}
          >
            <h1 className="font-extrabold text-white text-[17px] tracking-wide">{currentServer.name}</h1>
            {currentServer.isOwner && <Shield size={18} className="text-[#7038fa]" />}
          </div>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[65px] left-2 right-2 bg-[#111218] rounded-lg shadow-2xl border border-[#20212B] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              {currentServer.isOwner ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors group">
                    <span>Invite People</span>
                    <UserPlus size={16} />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">
                    <span>Server Settings</span>
                    <Settings size={16} />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">
                    <span>Create Channel</span>
                    <Plus size={16} />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">
                    <span>Edit Server Profile</span>
                    <Edit size={16} />
                  </div>
                  <div className="h-[1px] bg-[#20212B] my-1 mx-2"></div>
                  <div 
                    onClick={handleLeaveServer}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Delete Server</span>
                    <Trash2 size={16} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">
                    <span>Invite Friends</span>
                    <UserPlus size={16} />
                  </div>
                  <div className="h-[1px] bg-[#20212B] my-1 mx-2"></div>
                  <div 
                    onClick={handleLeaveServer}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Leave Server</span>
                    <LogOut size={16} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* When @me is selected, we could show Direct Messages list here, but currently it just shows empty state or GameHub channels. To avoid breaking things, we'll keep the channel list below for servers. */}
      {activeServer !== '@me' && (
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
      )}
    </div>
  );
};
