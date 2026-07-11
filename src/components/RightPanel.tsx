
import { Search } from 'lucide-react';

export const RightPanel = () => {
  return (
    <div className="w-[280px] bg-[#13141C] flex flex-col shrink-0 border-l border-[#20212B]">
      {/* Header */}
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-4 shrink-0 bg-[#13141C]/80 backdrop-blur-md z-10">
        <div className="relative w-full">
          <Search size={14} className="absolute left-2 top-1.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search users" 
            className="w-full bg-[#0E0F15] border border-[#20212B] rounded pl-8 pr-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-[#7038fa]/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Admins */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
            Admins — 1
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group">
              <div className="relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-8 h-8 rounded-full bg-[#0E0F15]" alt="User" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#13141C]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-white">System Admin</span>
                <span className="text-[11px] text-gray-500">Playing Custom Tool</span>
              </div>
            </div>
          </div>
        </div>

        {/* Online */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
            Online — 2
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group">
              <div className="relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shako" className="w-8 h-8 rounded-full bg-[#0E0F15]" alt="User" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#13141C]"></div>
              </div>
              <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">Shako</span>
            </div>
            
            <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group">
              <div className="relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luka" className="w-8 h-8 rounded-full bg-[#0E0F15]" alt="User" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-[#13141C]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">Luka</span>
                <span className="text-[11px] text-gray-500 font-medium">Idle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offline */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
            Offline — 3
          </h3>
          <div className="space-y-1 opacity-50">
            {['DeSant', 'Nika', 'Givi'].map((user) => (
              <div key={user} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group hover:opacity-100 transition-opacity">
                <div className="relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} className="w-8 h-8 rounded-full bg-[#0E0F15] grayscale" alt="User" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gray-500 rounded-full border-2 border-[#13141C]"></div>
                </div>
                <span className="text-[15px] font-medium text-gray-300">{user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
