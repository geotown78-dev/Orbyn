import { Compass, Plus, Hash, Shield, Settings, UserPlus, LogOut, Trash2, Edit, X, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';
import { ServerSettingsModal } from './ServerSettingsModal';
import { CreateChannelModal } from './CreateChannelModal';
import { InviteModal } from './InviteModal';

const AddServerModal = ({ isOpen, onClose, onCreate, onJoin }: any) => {
  const [view, setView] = useState<'options' | 'create' | 'join'>('options');
  const [serverName, setServerName] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (serverName.trim()) {
      onCreate(serverName.trim());
      setServerName('');
      setView('options');
      onClose();
    }
  };

  const handleJoin = () => {
    if (inviteLink.trim()) {
      onJoin(inviteLink.trim());
      setInviteLink('');
      setView('options');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#111218] rounded-xl w-full max-w-md border border-[#20212B] shadow-2xl relative flex flex-col max-h-full overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={() => { onClose(); setView('options'); }} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {view === 'options' && (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Create a server</h2>
            <p className="text-gray-400 mb-8">Your server is where you and your friends hang out. Make yours and start talking.</p>
            
            <button onClick={() => setView('create')} className="w-full flex items-center gap-3 p-4 bg-[#1A1B26] hover:bg-[#20212B] border border-[#20212B] rounded-lg mb-4 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#7038fa] flex items-center justify-center text-white shrink-0">
                <Plus size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-bold text-[17px] group-hover:text-[#7038fa] transition-colors">Create My Own</div>
              </div>
              <div className="text-gray-500">▶</div>
            </button>

            <div className="bg-[#1A1B26] p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Have an invite already?</h3>
              <button onClick={() => setView('join')} className="w-full bg-[#4e5058] hover:bg-[#5c5e66] text-white font-medium py-2 rounded transition-colors">
                Join a Server
              </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Customize your server</h2>
            <p className="text-gray-400 mb-8 text-center text-sm">Give your new server a personality with a name and an icon. You can always change it later.</p>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2 block">Server Name</label>
              <input 
                type="text" 
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full bg-[#1e1f22] text-white p-3 rounded border border-transparent focus:border-[#7038fa] outline-none transition-colors"
                placeholder="My Awesome Server"
              />
            </div>
            
            <div className="flex justify-between items-center bg-[#1A1B26] -mx-8 -mb-8 p-4 mt-8">
              <button onClick={() => setView('options')} className="text-white text-sm hover:underline">Back</button>
              <button onClick={handleCreate} disabled={!serverName.trim()} className="bg-[#7038fa] hover:bg-[#5b2bd1] disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Join a Server</h2>
            <p className="text-gray-400 mb-8 text-center text-sm">Enter an invite below to join an existing server.</p>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2 block">Invite Link *</label>
              <input 
                type="text" 
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                className="w-full bg-[#1e1f22] text-white p-3 rounded border border-transparent focus:border-[#7038fa] outline-none transition-colors"
                placeholder="https://orbyn.gg/..."
              />
            </div>
            
            <div className="flex justify-between items-center bg-[#1A1B26] -mx-8 -mb-8 p-4 mt-8">
              <button onClick={() => setView('options')} className="text-white text-sm hover:underline">Back</button>
              <button onClick={handleJoin} disabled={!inviteLink.trim()} className="bg-[#7038fa] hover:bg-[#5b2bd1] disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors">
                Join Server
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ServerSidebar = () => {
  const { user, activeServer, setActiveServer, servers, setServers, pendingRequestsCount, setActiveChannel } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateServer = async (name: string) => {
    if (!user) return;
    const newId = 'server_' + Date.now();
    const newServer = { id: newId, name, img: null };
    
    // Save to servers table
    const { error: serverError } = await supabase
      .from('servers')
      .insert([{ ...newServer, owner_id: user.id }])
      .select()
      .single();
      
    if (serverError) {
      console.error('Error creating server:', serverError);
      alert('Error creating server: ' + serverError.message);
      return;
    }
    
    // Add to server_members
    const { error: memberError } = await supabase
      .from('server_members')
      .insert([
        { server_id: newId, user_id: user.id, role: 'owner' }
      ])
      .select()
      .single();

    if (memberError) {
      console.error('Error adding member:', memberError);
      alert('Error adding member: ' + memberError.message);
      return;
    }
    // Add default channels
    const { error: channelsError } = await supabase.from('channels').insert([
      { id: `text_${Date.now()}`, server_id: newId, name: 'general', type: 'text', category: 'text' },
      { id: `text_${Date.now()+1}`, server_id: newId, name: 'gaming-talk', type: 'text', category: 'text' }
    ]);
    if (channelsError) {
      console.log('Could not add default channels (table might not exist yet):', channelsError);
    }


    setServers([...servers, { ...newServer, isOwner: true }]);
    setActiveServer(newId);
    setActiveChannel('general');
    setIsAddModalOpen(false);
  };

  const handleJoinServer = async (link: string) => {
    if (!user) return;
    const serverId = link.split('/').pop() || link;
    if (servers.find(s => s.id === serverId)) {
       setActiveServer(serverId);
       setActiveChannel('general');
       setIsAddModalOpen(false);
       return;
    }
    
    // Check if server exists
    const { data: serverData, error } = await supabase
      .from('servers')
      .select('*')
      .eq('id', serverId)
      .single();
      
    if (serverData && !error) {
      // Add member
      await supabase.from('server_members').upsert([
        { server_id: serverId, user_id: user.id, role: 'member' }
      ]);
      const newServer = { id: serverData.id, name: serverData.name, img: serverData.img, isOwner: false };
      setServers([...servers, newServer]);
      setActiveServer(serverId);
      setActiveChannel('general');
      setIsAddModalOpen(false);
    } else {
      console.error('Server not found');
    }
  };

  return (
    <div className="w-[72px] bg-[#0E0F15] flex flex-col items-center py-4 gap-3 shrink-0 border-r border-[#20212B]">
      {/* Home / Direct Messages */}
      <div className="relative group flex items-center justify-center w-full">
        <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${activeServer === '@me' ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
        <div 
          onClick={() => {
            setActiveServer('@me');
            setActiveChannel('friends');
          }}
          className={`relative w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(112,56,250,0.5)] ${activeServer === '@me' ? 'rounded-[16px]' : ''}`}
        >
           <span className="font-bold text-white text-xl">O</span>
           {pendingRequestsCount > 0 && (
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-[3px] border-[#0E0F15] flex items-center justify-center text-white text-[10px] font-bold">
               {pendingRequestsCount}
             </div>
           )}
        </div>
      </div>
      
      <div className="w-8 h-[2px] bg-[#20212B] rounded-full my-1"></div>

      {servers.map((server) => (
        <div key={server.id} className="relative group flex items-center justify-center w-full">
          <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${activeServer === server.id ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
          <div 
            onClick={() => {
              setActiveServer(server.id);
              setActiveChannel('general');
            }}
            className={`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#1A1B26] overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center ${activeServer === server.id ? 'rounded-[16px] ring-2 ring-[#7038fa] ring-offset-2 ring-offset-[#0E0F15]' : ''}`}
          >
            {server.img ? (
              <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-medium text-[15px]">{server.name ? server.name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase() : '?'}</span>
            )}
          </div>
        </div>
      ))}

      <div onClick={() => setIsAddModalOpen(true)} className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white mt-2">
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </div>

      <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#1A1B26] hover:bg-[#7038fa] flex items-center justify-center cursor-pointer transition-all duration-300 group text-[#22c55e] hover:text-white">
        <Compass size={24} />
      </div>

      <AddServerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateServer}
        onJoin={handleJoinServer}
      />
    </div>
  );
};

export const Sidebar = () => {
  const { activeServer, activeChannel, setActiveChannel, servers, setActiveServer } = useApp();
  const currentServer = servers.find(s => s.id === activeServer);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [hasChannelsTable, setHasChannelsTable] = useState(true);

  useEffect(() => {
    if (activeServer !== '@me') {
      const fetchChannels = async () => {
        const { data, error } = await supabase.from('channels').select('*').eq('server_id', activeServer);
        if (error) {
          console.log('Channels table not found or error:', error);
          setHasChannelsTable(false);
        } else if (data) {
          setHasChannelsTable(true);
          setChannels(data);
        }
      };
      fetchChannels();

      const sub = supabase.channel('public:channels')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'channels', filter: `server_id=eq.${activeServer}` }, fetchChannels)
        .subscribe();
      return () => { supabase.removeChannel(sub); };
    }
  }, [activeServer]);

  const handleLeaveServer = () => {
    setActiveServer('@me');
    setActiveChannel('general');
  };

  const textChannels = hasChannelsTable ? channels.filter(c => c.type === 'text') : [{ name: 'general', type: 'text' }, { name: 'gaming-talk', type: 'text' }, { name: 'memes', type: 'text' }, { name: 'lfg', type: 'text' }];
  const voiceChannels = hasChannelsTable ? channels.filter(c => c.type === 'voice') : [];

  return (
    <div className="w-[240px] bg-[#111218] flex flex-col shrink-0 border-r border-[#20212B]">
      {/* Server Header */}
      {currentServer && (
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`h-[60px] border-b border-[#20212B] flex items-center px-4 justify-between cursor-pointer transition-colors ${isDropdownOpen ? 'bg-[#1A1B26]' : 'hover:bg-[#1A1B26]'}`}
          >
            <h1 className="font-extrabold text-white text-[17px] tracking-wide">{currentServer.name}</h1>
            {currentServer.isOwner && <Shield size={18} className="text-[#7038fa]" />}
          </div>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[65px] left-2 right-2 bg-[#111218] rounded-lg shadow-2xl border border-[#20212B] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              {currentServer.isOwner ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors group">
                    <span>Invite People</span>
                    <UserPlus size={16} />
                  </div>
                  <div 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Server Settings</span>
                    <Settings size={16} />
                  </div>
                  <div 
                    onClick={() => {
                      setIsCreateChannelOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Create Channel</span>
                    <Plus size={16} />
                  </div>
                  <div 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Edit Server Profile</span>
                    <Edit size={16} />
                  </div>
                  <div className="h-[1px] bg-[#20212B] my-1 mx-2"></div>
                  <div 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Delete Server</span>
                    <Trash2 size={16} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#7038fa] hover:bg-[#7038fa] hover:text-white rounded cursor-pointer transition-colors">
                    <span>Invite Friends</span>
                    <UserPlus size={16} />
                  </div>
                  <div className="h-[1px] bg-[#20212B] my-1 mx-2"></div>
                  <div 
                    onClick={handleLeaveServer}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <span>Leave Server</span>
                    <LogOut size={16} />
                  </div>
                </>
              )}
            </div>
          )}
          
          <ServerSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            server={currentServer}
          />

          <CreateChannelModal
            isOpen={isCreateChannelOpen}
            onClose={() => setIsCreateChannelOpen(false)}
            serverId={currentServer.id}
          />

          <InviteModal
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            serverId={currentServer.id}
          />
        </div>
      )}

      {/* When @me is selected, we could show Direct Messages list here, but currently it just shows empty state or GameHub channels. To avoid breaking things, we'll keep the channel list below for servers. */}
      {activeServer !== '@me' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Info Channels */}
        {!hasChannelsTable && (
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer">
               <span className="w-3">▼</span> INFORMATION
            </div>
            <div className="space-y-0.5">
              <div 
                onClick={() => setActiveChannel('announcements')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${activeChannel === 'announcements' ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}`}
              >
                <Hash size={18} className={`${activeChannel === 'announcements' ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`} />
                <span className="font-medium text-[15px]">announcements</span>
              </div>
              <div 
                onClick={() => setActiveChannel('rules')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${activeChannel === 'rules' ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}`}
              >
                <Hash size={18} className={`${activeChannel === 'rules' ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`} />
                <span className="font-medium text-[15px]">rules</span>
              </div>
            </div>
          </div>
        )}

        {/* Text Channels */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer group">
             <div className="flex items-center gap-1"><span className="w-3">▼</span> TEXT CHANNELS</div>
             {currentServer?.isOwner && (
               <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsCreateChannelOpen(true)} />
             )}
          </div>
          <div className="space-y-0.5">
            {textChannels.map((channel: any) => (
              <div 
                key={channel.id || channel.name}
                onClick={() => setActiveChannel(channel.name)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${activeChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}`}
              >
                <Hash size={18} className={`${activeChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`} />
                <span className="font-medium text-[15px]">{channel.name}</span>
                {activeChannel !== channel.name && channel.name === 'memes' && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        {(hasChannelsTable && voiceChannels.length > 0) && (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 hover:text-gray-300 cursor-pointer group">
               <div className="flex items-center gap-1"><span className="w-3">▼</span> VOICE CHANNELS</div>
               {currentServer?.isOwner && (
                 <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsCreateChannelOpen(true)} />
               )}
            </div>
            <div className="space-y-0.5">
              {voiceChannels.map((channel: any) => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.name)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${activeChannel === channel.name ? 'bg-[#20212B] text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1B26]'}`}
                >
                  <Volume2 size={18} className={`${activeChannel === channel.name ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="font-medium text-[15px]">{channel.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>
      )}
    </div>
  );
};
