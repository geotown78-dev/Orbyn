const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The new render part
const newRender = `
  return (
    <div className="flex flex-col h-screen w-full bg-[#0E0F15] text-gray-300 font-sans overflow-hidden selection:bg-[#7038fa]/30 relative">
      <ConnectionOverlay />
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <ServerSidebar />
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
      </div>
      <SettingsModal />
    </div>
  );
};
`;

// we need to get activeServer from useApp
content = content.replace('const { isAuthenticated } = useApp();', 'const { isAuthenticated, activeServer } = useApp();');

// replace the old return with the new one
content = content.replace(/return \(\s*<div className="flex flex-col h-screen w-full[\s\S]*\}\;/g, newRender.trim());

fs.writeFileSync('src/App.tsx', content);
