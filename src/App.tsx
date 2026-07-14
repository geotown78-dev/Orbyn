import { useEffect, useState } from "react";

import { useApp } from './AppContext';
import { ServerSidebar, Sidebar } from './components/Navigation';
import { Chat } from './components/Chat';
import { supabase } from './lib/supabase';
import { RightPanel } from './components/RightPanel';
import { SettingsModal } from './components/SettingsModal';
import { Auth } from './components/Auth';
import { TopNav } from './components/TopNav';
import { WifiOff } from 'lucide-react';import { HomeSidebar, HomeMain, HomeRightPanel } from './components/HomeView';

const ConnectionOverlay = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="absolute inset-0 bg-[#0E0F15]/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-[#7038fa]/20 rounded-full flex items-center justify-center mb-6">
        <WifiOff size={32} className="text-[#7038fa]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Connecting...</h2>
      <p className="text-gray-400">Waiting for network connection</p>
    </div>
  );
};

export const App = () => {
  const { isAuthenticated, activeServer, activeChannel } = useApp();
  


  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full bg-[#0E0F15] overflow-hidden relative">
         <TopNav />
         <Auth />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0E0F15] text-gray-300 font-sans overflow-hidden selection:bg-[#7038fa]/30 relative">
      <ConnectionOverlay />
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <ServerSidebar />
        {activeServer === '@me' ? (
          <>
            <HomeSidebar />
            {activeChannel.startsWith('dm_') ? (
               <Chat />
            ) : (
               <>
                 <HomeMain />
                 <HomeRightPanel />
               </>
            )}
          </>
        ) : activeServer === 'orbyn' ? (

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
