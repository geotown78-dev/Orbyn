import { useState, useEffect } from 'react';
import { X, Copy, Check, Search } from 'lucide-react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export const InviteModal = ({ isOpen, onClose, serverId }: Props) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, user } = useApp();
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setInvitedMap({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/${serverId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (friendId: string) => {
    if (!user) return;
    
    setInvitedMap(prev => ({ ...prev, [friendId]: true }));
    
    // Send them a DM with the invite link
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    const dmChannelId = [user.name, friend.username].sort().join('_');
    
    await supabase.from('messages').insert([{
      id: Date.now().toString(),
      user_name: user.name,
      user_avatar: user.avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inviteLink,
      channel_id: dmChannelId
    }]);
  };

  const filteredFriends = friends.filter(f => f.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-[#1A1B26] w-full max-w-md rounded-xl shadow-2xl border border-[#20212B] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        <div className="p-6 pb-4 border-b border-[#20212B]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Invite friends to server</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search friends"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13141C] text-white pl-10 pr-4 py-2.5 rounded-lg border border-[#20212B] focus:outline-none focus:border-[#7038fa] transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar min-h-[200px]">
          {filteredFriends.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm py-8">
              No friends found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-[#20212B] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt={friend.username} className="w-8 h-8 rounded-full bg-[#13141C]" />
                    <span className="text-white font-medium text-sm">{friend.username}</span>
                  </div>
                  <button 
                    onClick={() => handleInvite(friend.id)}
                    disabled={invitedMap[friend.id]}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${invitedMap[friend.id] ? 'bg-transparent border border-green-500 text-green-500' : 'bg-[#20212B] hover:bg-[#7038fa] text-white border border-transparent'}`}
                  >
                    {invitedMap[friend.id] ? 'Invited' : 'Invite'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-[#13141C] border-t border-[#20212B]">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Or, send a server invite link to a friend
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-[#1A1B26] text-white px-3 py-2 rounded border border-[#20212B] focus:outline-none focus:border-[#7038fa] transition-colors text-sm"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-medium transition-colors text-sm ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#7038fa] hover:bg-[#5b2bd1] text-white'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
