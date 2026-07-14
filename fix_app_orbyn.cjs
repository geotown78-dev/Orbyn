const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const emptyOrbynView = `
          <>
            <Sidebar />
            <div className="flex-1 bg-[#13141C] flex items-center justify-center relative">
               <div className="text-center z-10 p-8 max-w-lg">
                 <div className="w-24 h-24 bg-[#7038fa]/10 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(112,56,250,0.3)]">
                   <span className="text-4xl">✨</span>
                 </div>
                 <h2 className="text-3xl font-black text-white mb-4">Welcome to Orbyn</h2>
                 <p className="text-gray-400 text-lg mb-8">Your completely empty workspace. Create channels, invite friends, and start building your community from scratch.</p>
                 <button className="bg-[#7038fa] hover:bg-[#5b2bd1] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-[0_0_20px_rgba(112,56,250,0.4)]">
                   Create Channel
                 </button>
               </div>
            </div>
          </>
`;

// we need to replace the logic inside App.tsx
// It currently has:
/*
        {activeServer === '@me' ? (
          <>
            <HomeSidebar />
            <HomeMain />
            <HomeRightPanel />
          </>
        ) : (
          <>
            <Sidebar />
            <Chat />
            <RightPanel />
          </>
        )}
*/

const newLogic = `
        {activeServer === '@me' ? (
          <>
            <HomeSidebar />
            <HomeMain />
            <HomeRightPanel />
          </>
        ) : activeServer === 'orbyn' ? (
${emptyOrbynView}
        ) : (
          <>
            <Sidebar />
            <Chat />
            <RightPanel />
          </>
        )}
`;

content = content.replace(/\{activeServer === '@me' \? \([\s\S]*?<RightPanel \/>\s*<\/>\s*\)\}/, newLogic.trim());

fs.writeFileSync('src/App.tsx', content);
