import { Users, Search, MessageSquare } from 'lucide-react';


export const HomeSidebar = () => {
  return (
    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
      {/* Search Input */}
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-4 justify-center">
        <div className="w-full bg-[#1A1B26] border border-[#20212B] rounded-xl flex items-center px-3 py-1.5">
           <Search size={16} className="text-gray-500 mr-2" />
           <input type="text" placeholder="Find or start a conversation" className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder-gray-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* Friends Tab */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#20212B] text-white cursor-pointer transition-colors">
          <Users size={20} className="text-gray-300" />
          <span className="font-medium text-[15px]">Friends</span>
        </div>

        {/* Direct Messages Header */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 hover:text-gray-300 cursor-pointer">
             <span>DIRECT MESSAGES</span>
             <span className="text-lg leading-none mb-1">+</span>
          </div>
          
          {/* Empty State for DMs */}
          <div className="px-3 py-4 text-center">
            <p className="text-[13px] text-gray-500 font-medium">No direct messages yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeMain = () => {
  return (
    <div className="flex-1 bg-[#181922] flex flex-col min-w-0 relative">
      {/* Header */}
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-6 shrink-0 justify-between bg-[#13141C]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-[#20212B] pr-6">
            <Users size={24} className="text-gray-500" />
            <h2 className="text-[17px] font-extrabold text-white tracking-wide">Friends</h2>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-[15px] font-medium text-white px-2 py-1 bg-[#1A1B26] rounded-lg">Online</button>
             <button className="text-[15px] font-medium text-gray-400 hover:text-gray-200 transition-colors px-2 py-1">All</button>
             <button className="text-[15px] font-medium text-gray-400 hover:text-gray-200 transition-colors px-2 py-1">Pending</button>
             <button className="text-[14px] font-bold text-white px-3 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] transition-colors rounded-lg ml-2">Add Friend</button>
          </div>
        </div>
      </div>

      {/* Main Content (Empty State) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-48 mb-8 opacity-40">
           {/* Placeholder for an empty state illustration */}
           <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="100" cy="100" r="80" stroke="#7038fa" strokeWidth="4" strokeDasharray="10 10"/>
             <path d="M70 100 L90 120 L130 80" stroke="#7038fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <h3 className="text-gray-400 font-medium text-lg mb-2">No one's around to play with Wumpus.</h3>
        <p className="text-gray-500 text-sm max-w-md">Try adding some friends or joining a server to see them here.</p>
      </div>
    </div>
  );
};

export const HomeRightPanel = () => {
  return (
    <div className="w-[280px] bg-[#13141C] border-l border-[#20212B] flex flex-col shrink-0 p-4">
      <h3 className="text-sm font-bold text-white mb-4">Active Now</h3>
      
      {/* Empty State */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <div className="w-16 h-16 bg-[#1A1B26] rounded-full flex items-center justify-center mb-4">
          <MessageSquare size={24} className="text-gray-600" />
        </div>
        <h4 className="text-white font-medium mb-1">It's quiet for now...</h4>
        <p className="text-[13px] text-gray-500">When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
      </div>
    </div>
  );
};
