import { useState, useEffect } from "react";
import { Hash, Plus, Gift, Smile, AtSign } from 'lucide-react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';

type Message = {
  id: string;
  user_name: string;
  user_avatar: string;
  user_role?: string;
  time: string;
  content: string;
  channel_id: string;
};

export const Chat = () => {
  const { user, activeChannel } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const isDM = activeChannel.startsWith('dm_');
  const dmTarget = isDM ? activeChannel.replace('dm_', '') : '';
  const actualChannelId = isDM && user ? [user.name, dmTarget].sort().join('_') : activeChannel;

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', actualChannelId)
        .order('created_at', { ascending: true });
      
      if (data && !error) {
        setMessages(data);
      }
    };
    
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `channel_id=eq.${actualChannelId}`
      }, payload => {
        setMessages(prev => {
          if (prev.some(msg => msg.id === payload.new.id)) {
            return prev;
          }
          return [...prev, payload.new as Message];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [actualChannelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      user_name: user.name,
      user_avatar: user.avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputValue,
      channel_id: actualChannelId
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Save to Supabase
    await supabase.from('messages').insert([newMessage]);
  };

  return (
    <div className="flex-1 bg-[#13141C] flex flex-col min-w-0 relative">
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-6 shrink-0 justify-between bg-[#13141C]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Hash size={24} className="text-gray-500" />
          <h2 className="text-[17px] font-extrabold text-white tracking-wide">{isDM ? dmTarget : activeChannel}</h2>
          <div className="h-5 w-[1px] bg-[#20212B] mx-2"></div>
          <p className="text-sm text-gray-400 font-medium tracking-wide">{isDM ? `Direct message with ${dmTarget}` : `General chat for everyone`}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar flex flex-col">
        <div className="flex flex-col items-center justify-center my-8 mt-auto">
          <div className="w-20 h-20 bg-[#1E1F2A] rounded-full flex items-center justify-center mb-4">
             <Hash size={40} className="text-gray-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{isDM ? `Chat with ${dmTarget}` : `Welcome to #${activeChannel}!`}</h1>
          <p className="text-gray-400 text-center max-w-md">{isDM ? `This is the beginning of your direct message history with ${dmTarget}.` : `This is the start of the #${activeChannel} channel. Say hi to everyone!`}</p>
        </div>
        
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="flex gap-4 group">
            <img src={msg.user_avatar} className="w-10 h-10 rounded-full bg-[#1E1F2A] mt-0.5 shadow-md" alt="Avatar" />
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold cursor-pointer hover:underline text-[15px] tracking-wide text-white">{msg.user_name}</span>
                {msg.user_role && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 border border-gray-600 rounded px-1.5 py-0.5 ml-1 leading-none uppercase">
                    <AtSign size={8}/> {msg.user_role}
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium ml-1">{msg.time}</span>
              </div>
              <p className="text-gray-300 text-[15px] leading-relaxed mb-3">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 pt-2 shrink-0 bg-[#13141C]">
        <form onSubmit={handleSendMessage} className="bg-[#181922] border border-[#20212B] focus-within:border-[#7038fa]/50 transition-colors rounded-full flex items-center px-4 py-3 gap-4 shadow-lg">
          <button type="button" className="w-7 h-7 rounded-full bg-gray-600 hover:bg-gray-400 flex items-center justify-center text-[#181922] transition-colors shrink-0 shadow-inner">
            <Plus size={18} className="font-bold" />
          </button>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isDM ? `Message @${dmTarget}` : `Message #${activeChannel}`} 
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-[15px]"
          />
          <div className="flex items-center gap-4 text-gray-500">
            <Gift size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
            <div className="font-black text-[11px] border-2 border-gray-400 rounded px-1.5 hover:text-white hover:border-white cursor-pointer transition-colors tracking-wider">GIF</div>
            <Smile size={20} className="hover:text-yellow-500 cursor-pointer transition-colors" />
          </div>
        </form>
      </div>
    </div>
  );
};
