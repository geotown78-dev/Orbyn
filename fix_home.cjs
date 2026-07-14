const fs = require('fs');

let content = `import { Users, Search, MessageSquare, Check, X, UserPlus, Clock } from 'lucide-react';
import { useState } from 'react';

export const HomeSidebar = () => {
  return (
    <div className="w-[260px] bg-[#13141C] flex flex-col shrink-0 border-r border-[#20212B]">
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-4 justify-center">
        <div className="w-full bg-[#1A1B26] border border-[#20212B] rounded-xl flex items-center px-3 py-1.5">
           <Search size={16} className="text-gray-500 mr-2" />
           <input type="text" placeholder="Find or start a conversation" className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder-gray-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#20212B] text-white cursor-pointer transition-colors">
          <Users size={20} className="text-gray-300" />
          <span className="font-medium text-[15px]">Friends</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 hover:text-gray-300 cursor-pointer">
             <span>DIRECT MESSAGES</span>
             <span className="text-lg leading-none mb-1">+</span>
          </div>
          
          <div className="px-3 py-4 text-center">
            <p className="text-[13px] text-gray-500 font-medium">No direct messages yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeMain = () => {
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add_friend'>('online');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for requests
  const [sentRequests, setSentRequests] = useState([
    { id: '1', username: 'Luka', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luka' }
  ]);
  const [receivedRequests, setReceivedRequests] = useState([
    { id: '2', username: 'Givi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Givi' }
  ]);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (addFriendInput.trim()) {
      setSentRequests([...sentRequests, { id: Date.now().toString(), username: addFriendInput, avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${addFriendInput}\` }]);
      setSuccessMessage(\`Success! Your friend request to \${addFriendInput} was sent.\`);
      setAddFriendInput('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const cancelRequest = (id: string) => {
    setSentRequests(sentRequests.filter(req => req.id !== id));
  };

  const acceptRequest = (id: string) => {
    setReceivedRequests(receivedRequests.filter(req => req.id !== id));
    // Ideally add to friends list here
  };

  const declineRequest = (id: string) => {
    setReceivedRequests(receivedRequests.filter(req => req.id !== id));
  };

  return (
    <div className="flex-1 bg-[#181922] flex flex-col min-w-0 relative">
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-6 shrink-0 justify-between bg-[#13141C]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-[#20212B] pr-6">
            <Users size={24} className="text-gray-500" />
            <h2 className="text-[17px] font-extrabold text-white tracking-wide">Friends</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setActiveTab('online')}
               className={\`text-[15px] font-medium px-2 py-1 rounded-lg transition-colors \${activeTab === 'online' ? 'text-white bg-[#1A1B26]' : 'text-gray-400 hover:text-gray-200'}\`}
             >
               Online
             </button>
             <button 
               onClick={() => setActiveTab('all')}
               className={\`text-[15px] font-medium px-2 py-1 rounded-lg transition-colors \${activeTab === 'all' ? 'text-white bg-[#1A1B26]' : 'text-gray-400 hover:text-gray-200'}\`}
             >
               All
             </button>
             <button 
               onClick={() => setActiveTab('pending')}
               className={\`text-[15px] font-medium px-2 py-1 rounded-lg transition-colors \${activeTab === 'pending' ? 'text-white bg-[#1A1B26]' : 'text-gray-400 hover:text-gray-200'}\`}
             >
               Pending
               {(sentRequests.length > 0 || receivedRequests.length > 0) && (
                 <span className="ml-1.5 bg-red-500 text-white text-[11px] px-1.5 py-0.5 rounded-full">
                   {sentRequests.length + receivedRequests.length}
                 </span>
               )}
             </button>
             <button 
               onClick={() => setActiveTab('add_friend')}
               className={\`text-[14px] font-bold px-3 py-1.5 transition-colors rounded-lg ml-2 \${activeTab === 'add_friend' ? 'text-white bg-transparent text-[#22c55e]' : 'text-white bg-[#22c55e] hover:bg-[#16a34a]'}\`}
             >
               Add Friend
             </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
        {activeTab === 'add_friend' && (
          <div>
            <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-wide">Add Friend</h3>
            <p className="text-gray-400 text-sm mb-4">You can add friends with their Orbyn username.</p>
            <form onSubmit={handleSendRequest} className="relative mb-6">
              <div className="flex items-center bg-[#13141C] border border-[#20212B] rounded-lg p-1.5 focus-within:border-[#7038fa] transition-colors">
                <input 
                  type="text" 
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  placeholder="You can add friends with their Orbyn username." 
                  className="bg-transparent border-none outline-none text-white w-full px-3 text-[15px]"
                />
                <button 
                  type="submit"
                  disabled={!addFriendInput.trim()}
                  className={\`px-4 py-2 rounded-md font-medium text-sm transition-colors \${addFriendInput.trim() ? 'bg-[#7038fa] text-white hover:bg-[#5b2bd1]' : 'bg-[#7038fa]/50 text-white/50 cursor-not-allowed'}\`}
                >
                  Send Friend Request
                </button>
              </div>
            </form>
            {successMessage && (
              <p className="text-[#22c55e] text-sm">{successMessage}</p>
            )}
            
            <div className="flex flex-col items-center justify-center mt-12 text-center opacity-60">
               <div className="w-48 h-48 mb-8">
                 <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="100" cy="100" r="80" stroke="#7038fa" strokeWidth="4" strokeDasharray="10 10"/>
                   <path d="M70 100 L90 120 L130 80" stroke="#7038fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               <h3 className="text-gray-400 font-medium text-lg">Wumpus is waiting on friends.</h3>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="max-w-[800px] w-full">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Pending — {sentRequests.length + receivedRequests.length}</h3>
            
            {receivedRequests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white text-sm font-medium mb-2 border-b border-[#20212B] pb-2">Received Requests</h4>
                <div className="space-y-1">
                  {receivedRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1B26] border-t border-[#20212B] group">
                      <div className="flex items-center gap-3">
                        <img src={req.avatar} alt={req.username} className="w-10 h-10 rounded-full bg-[#13141C]" />
                        <div>
                          <div className="text-white font-medium">{req.username}</div>
                          <div className="text-xs text-gray-400">Incoming Friend Request</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => acceptRequest(req.id)} className="w-9 h-9 rounded-full bg-[#20212B] flex items-center justify-center text-gray-400 hover:text-[#22c55e] transition-colors" title="Accept">
                          <Check size={18} />
                        </button>
                        <button onClick={() => declineRequest(req.id)} className="w-9 h-9 rounded-full bg-[#20212B] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Ignore">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sentRequests.length > 0 && (
              <div>
                <h4 className="text-white text-sm font-medium mb-2 border-b border-[#20212B] pb-2">Sent Requests</h4>
                <div className="space-y-1">
                  {sentRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1B26] border-t border-[#20212B] group">
                      <div className="flex items-center gap-3">
                        <img src={req.avatar} alt={req.username} className="w-10 h-10 rounded-full bg-[#13141C]" />
                        <div>
                          <div className="text-white font-medium">{req.username}</div>
                          <div className="text-xs text-gray-400">Outgoing Friend Request</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => cancelRequest(req.id)} className="w-9 h-9 rounded-full bg-[#20212B] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Cancel">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {sentRequests.length === 0 && receivedRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-12 text-center opacity-60">
                 <div className="w-48 h-48 mb-8">
                   <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <circle cx="100" cy="100" r="80" stroke="#7038fa" strokeWidth="4" strokeDasharray="10 10"/>
                   </svg>
                 </div>
                 <h3 className="text-gray-400 font-medium text-lg">No pending friend requests</h3>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'online' || activeTab === 'all') && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 mb-8 opacity-40">
               <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="80" stroke="#7038fa" strokeWidth="4" strokeDasharray="10 10"/>
                 <path d="M70 100 L90 120 L130 80" stroke="#7038fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <h3 className="text-gray-400 font-medium text-lg mb-2">No one's around to play with Wumpus.</h3>
            <p className="text-gray-500 text-sm max-w-md">Try adding some friends or joining a server to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const HomeRightPanel = () => {
  return (
    <div className="w-[280px] bg-[#13141C] border-l border-[#20212B] flex flex-col shrink-0 p-4">
      <h3 className="text-sm font-bold text-white mb-4">Active Now</h3>
      
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
`

fs.writeFileSync('src/components/HomeView.tsx', content);
