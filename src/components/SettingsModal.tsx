
import { X, User, Bell, Shield, Paintbrush, Monitor, LogOut } from 'lucide-react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen, setIsAuthenticated } = useApp();

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex bg-[#0E0F15]/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl h-[85vh] m-auto bg-[#13141C] rounded-2xl shadow-2xl border border-[#20212B] flex overflow-hidden relative"
        >
          {/* Close Button */}
          <div 
            onClick={() => setSettingsOpen(false)}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#1A1B26] hover:bg-gray-700 flex items-center justify-center cursor-pointer border border-[#2A2B36] transition-colors z-10 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </div>

          {/* Settings Sidebar */}
          <div className="w-[280px] bg-[#0E0F15] border-r border-[#20212B] p-6 flex flex-col">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 px-3">User Settings</h2>
            
            <nav className="space-y-1 flex-1 flex flex-col">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium bg-[#1A1B26] text-white">
                <User size={18} className="text-[#7038fa]"/> My Account
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1B26] transition-colors">
                <Shield size={18} /> Privacy & Safety
              </a>
              
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">App Settings</h2>
              
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1B26] transition-colors">
                <Paintbrush size={18} /> Appearance
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1B26] transition-colors">
                <Bell size={18} /> Notifications
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1B26] transition-colors">
                <Monitor size={18} /> Voice & Video
              </a>
              
              <div className="my-4 border-t border-[#20212B]" />
              
              <button 
                onClick={() => {
                  setIsAuthenticated(false);
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-auto"
              >
                <LogOut size={18} /> Log Out
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-[#13141C] p-10 overflow-y-auto custom-scrollbar">
            <h1 className="text-2xl font-bold text-white mb-8">My Account</h1>
            
            {/* Profile Card */}
            <div className="bg-[#181922] border border-[#20212B] rounded-2xl overflow-hidden mb-8 shadow-lg">
              <div className="h-24 bg-gradient-to-r from-[#7038fa] to-[#4b1fc4]"></div>
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-[#181922] bg-[#0E0F15] overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=OrbynUser" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-end pt-4 mb-4">
                  <button className="px-4 py-1.5 bg-[#7038fa] hover:bg-[#5b2bd4] text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(112,56,250,0.4)]">
                    Edit User Profile
                  </button>
                </div>
                
                <div className="bg-[#0E0F15] border border-[#20212B] rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Username</p>
                    <p className="text-white font-medium text-[15px]">OrbynUser</p>
                  </div>
                  <button className="px-4 py-1.5 bg-[#20212B] hover:bg-[#2A2B36] text-white text-sm font-medium rounded-lg transition-colors border border-[#2A2B36]">
                    Edit
                  </button>
                </div>
                
                <div className="bg-[#0E0F15] border border-[#20212B] rounded-xl p-4 flex items-center justify-between mt-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-white font-medium text-[15px]">user@example.com</p>
                  </div>
                  <button className="px-4 py-1.5 bg-[#20212B] hover:bg-[#2A2B36] text-white text-sm font-medium rounded-lg transition-colors border border-[#2A2B36]">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            
            {/* Password Section */}
            <h2 className="text-lg font-bold text-white mb-4">Password and Authentication</h2>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-[#7038fa] hover:bg-[#5b2bd4] text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(112,56,250,0.4)]">
                Change Password
              </button>
              
              <div className="flex items-center justify-between bg-[#181922] border border-[#20212B] rounded-xl p-4 mt-4">
                <div>
                  <h3 className="text-white font-medium mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Protect your account with an extra layer of security.</p>
                </div>
                <button className="px-4 py-2 bg-[#20212B] hover:bg-[#2A2B36] text-white text-sm font-medium rounded-lg transition-colors border border-[#2A2B36]">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
