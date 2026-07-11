import { useState } from "react";

import { Hash, Plus, Gift, Smile, AtSign } from 'lucide-react';
import { currentUser } from '../AppContext';

type Message = {
  id: string;
  user: { name: string; avatar: string; role?: string };
  time: string;
  content: string;
  isBot?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 'm1',
    user: { name: 'Shako', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shako' },
    time: 'Today at 15:30',
    content: "Who's up for some ranked matches later?"
  },
  {
    id: 'm2',
    user: { name: 'Luka', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luka' },
    time: 'Today at 15:31',
    content: "I'm in! Let's grind 💪"
  },
  {
    id: 'm3',
    user: { name: 'DeSant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeSant', role: 'Mod' },
    time: 'Today at 15:32',
    content: "Don't forget, we have a tournament this weekend!"
  }
];

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: currentUser,
      time: 'Just now',
      content: inputValue
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex-1 bg-[#13141C] flex flex-col min-w-0 relative">
      {/* Header */}
      <div className="h-[60px] border-b border-[#20212B] flex items-center px-6 shrink-0 justify-between bg-[#13141C]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Hash size={24} className="text-gray-500" />
          <h2 className="text-[17px] font-extrabold text-white tracking-wide">general</h2>
          <div className="h-5 w-[1px] bg-[#20212B] mx-2"></div>
          <p className="text-sm text-gray-400 font-medium tracking-wide">General chat for everyone</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
        <div className="flex flex-col items-center justify-center my-8">
          <div className="w-20 h-20 bg-[#1E1F2A] rounded-full flex items-center justify-center mb-4">
             <Hash size={40} className="text-gray-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome to #general!</h1>
          <p className="text-gray-400 text-center max-w-md">This is the start of the #general channel. Say hi to everyone!</p>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className="flex gap-4 group">
            <img src={msg.user.avatar} className="w-10 h-10 rounded-full bg-[#1E1F2A] mt-0.5 shadow-md" alt="Avatar" />
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`font-bold cursor-pointer hover:underline text-[15px] tracking-wide ${msg.user.name === 'DeSant' ? 'text-[#f43f5e]' : msg.user.name === 'Luka' ? 'text-[#0ea5e9]' : 'text-white'}`}>{msg.user.name}</span>
                {msg.user.role && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 border border-gray-600 rounded px-1.5 py-0.5 ml-1 leading-none uppercase">
                    <AtSign size={8}/> {msg.user.role}
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium ml-1">{msg.time}</span>
              </div>
              <p className="text-gray-300 text-[15px] leading-relaxed mb-3">{msg.content}</p>
              
              {msg.id === 'm3' && (
                <div className="bg-[#1A1B26] border border-[#20212B] rounded-2xl p-4 max-w-md flex items-center justify-between cursor-pointer hover:border-[#7038fa]/50 transition-colors group/card shadow-lg">
                  <div>
                    <p className="text-sm font-bold text-white mb-1 tracking-wide">Check the bracket and rules here</p>
                    <p className="text-xs text-[#7038fa] group-hover/card:underline font-medium">https://gamehub.gg/tournaments/25</p>
                  </div>
                  <div className="w-16 h-16 bg-[#0E0F15] rounded-xl flex items-center justify-center overflow-hidden border border-[#20212B] shadow-inner ml-4">
                     <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-opacity" alt="thumb"/>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-2 shrink-0 bg-[#13141C]">
        <form onSubmit={handleSendMessage} className="bg-[#181922] border border-[#20212B] focus-within:border-[#7038fa]/50 transition-colors rounded-full flex items-center px-4 py-3 gap-4 shadow-lg">
          <button type="button" className="w-7 h-7 rounded-full bg-gray-600 hover:bg-gray-400 flex items-center justify-center text-[#181922] transition-colors shrink-0 shadow-inner">
            <Plus size={18} className="font-bold" />
          </button>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message #general" 
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
