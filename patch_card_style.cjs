const fs = require('fs');
let code = fs.readFileSync('src/components/ServerInviteCard.tsx', 'utf8');

code = code.replace(
    /return \([\s\S]*?\);\n\};/,
    `return (
    <div className="bg-[#2B2D31] rounded-lg mt-2 max-w-[432px] overflow-hidden">
       <div className="h-[60px] bg-gradient-to-b from-[#1E1F22] to-[#2B2D31]"></div>
       <div className="px-4 pb-4 relative">
          <div className="absolute -top-[30px]">
             {serverData.img ? (
                <img src={serverData.img} className="w-16 h-16 rounded-2xl object-cover border-[6px] border-[#2B2D31] bg-[#2B2D31]" alt="Server Icon" />
             ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7038fa] to-[#4b1fc4] flex items-center justify-center text-white font-bold text-2xl border-[6px] border-[#2B2D31] shadow-lg">
                  {serverData.name.charAt(0).toUpperCase()}
                </div>
             )}
          </div>
          <div className="pt-10">
            <h3 className="text-white font-bold text-[16px]">{serverData.name}</h3>
            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-400 mt-1 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#23a559] rounded-full"></div>
                <span>{onlineCount} Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#80848e] rounded-full"></div>
                <span>{membersCount} Members</span>
              </div>
            </div>
            <button 
              onClick={handleJoin} 
              className="w-full bg-[#248046] hover:bg-[#1a6334] text-white font-medium py-2.5 rounded transition-colors text-sm"
            >
               {isMember ? 'Go to Server' : 'Join Server'}
            </button>
          </div>
       </div>
    </div>
  );
};`
);

fs.writeFileSync('src/components/ServerInviteCard.tsx', code);
console.log("Patched ServerInviteCard style");
