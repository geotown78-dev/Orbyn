import { useState } from 'react';
import { X, Hash, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export const CreateChannelModal = ({ isOpen, onClose, serverId }: Props) => {
  const { user, setActiveChannel } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<'text' | 'voice'>('text');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen || !user) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);

    const newChannelId = `${type}_${Date.now()}`;
    const formattedName = name.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      const { error } = await supabase
        .from('channels')
        .insert([{
          id: newChannelId,
          server_id: serverId,
          name: formattedName,
          type: type,
          category: type === 'text' ? 'text' : 'voice'
        }]);

      if (error) {
        // If the table doesn't exist yet, we will just use it locally or show error.
        // For now, let's throw it to be caught.
        throw error;
      }

      setActiveChannel(newChannelId);
      onClose();
      setName('');
      setType('text');
    } catch (error: any) {
      console.error('Error creating channel:', error);
      alert('Error creating channel. Have you run the updated Supabase schema to create the channels table? ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-[#313338] w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-[#2B2D31] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create Channel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">
              Channel Type
            </label>
            <div className="space-y-2">
              <div 
                onClick={() => setType('text')}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${type === 'text' ? 'bg-[#404249]' : 'bg-[#2B2D31] hover:bg-[#383A40]'}`}
              >
                <Hash size={24} className="text-[#80848E]" />
                <div>
                  <div className="text-white font-medium">Text</div>
                  <div className="text-[#B5BAC1] text-xs">Post images, GIFs, stickers, opinions, and puns</div>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${type === 'text' ? 'border-white' : 'border-[#80848E]'}`}>
                  {type === 'text' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </div>

              <div 
                onClick={() => setType('voice')}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${type === 'voice' ? 'bg-[#404249]' : 'bg-[#2B2D31] hover:bg-[#383A40]'}`}
              >
                <Volume2 size={24} className="text-[#80848E]" />
                <div>
                  <div className="text-white font-medium">Voice</div>
                  <div className="text-[#B5BAC1] text-xs">Hang out together with voice, video, and screen share</div>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${type === 'voice' ? 'border-white' : 'border-[#80848E]'}`}>
                  {type === 'voice' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">
              Channel Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#80848E]">
                {type === 'text' ? <Hash size={18} /> : <Volume2 size={18} />}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1E1F22] text-white pl-9 pr-4 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="new-channel"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#2B2D31] p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white hover:underline transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating || !name.trim()}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
};
