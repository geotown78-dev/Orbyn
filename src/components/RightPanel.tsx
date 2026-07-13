
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';

type Member = {
  user_id: string;
  username: string;
  avatar: string;
  role: string;
  status: 'online' | 'offline';
};

export const RightPanel = () => {
  const { activeServer } = useApp();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (activeServer === '@me') return;

    const fetchMembers = async () => {
      // 1. Get members for the active server
      const { data: serverMembers, error: membersError } = await supabase
        .from('server_members')
        .select('user_id, role')
        .eq('server_id', activeServer);

      if (membersError || !serverMembers || serverMembers.length === 0) return;

      const userIds = serverMembers.map(m => m.user_id);

      // 2. Get user info from user_settings
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('user_id, username, avatar')
        .in('user_id', userIds);

      if (settingsError || !userSettings) return;

      const mappedMembers = serverMembers.map(m => {
        const settings = userSettings.find(s => s.user_id === m.user_id);
        return {
          user_id: m.user_id,
          username: settings?.username || 'Unknown User',
          avatar: settings?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user_id}`,
          role: m.role,
          status: 'online' as const
        };
      });

      setMembers(mappedMembers);
    };

    fetchMembers();
  }, [activeServer]);

  const admins = members.filter(m => m.role === 'owner');
  const online = members.filter(m => m.role !== 'owner');

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
        {admins.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
              Admins — {admins.length}
            </h3>
            <div className="space-y-1">
              {admins.map(admin => (
                <div key={admin.user_id} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group">
                  <div className="relative">
                    <img src={admin.avatar} className="w-8 h-8 rounded-full bg-[#0E0F15]" alt={admin.username} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#13141C]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-medium text-white">{admin.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online Members */}
        {online.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
              Members — {online.length}
            </h3>
            <div className="space-y-1">
              {online.map(user => (
                <div key={user.user_id} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1A1B26] cursor-pointer group">
                  <div className="relative">
                    <img src={user.avatar} className="w-8 h-8 rounded-full bg-[#0E0F15]" alt={user.username} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#13141C]"></div>
                  </div>
                  <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
