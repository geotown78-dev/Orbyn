import { useState, useEffect } from 'react';
import { X, Save, Trash2, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  server: { id: string; name: string; img: string | null } | null;
}

export const ServerSettingsModal = ({ isOpen, onClose, server }: Props) => {
  const { user, servers, setServers, setActiveServer } = useApp();
  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (server) {
      setName(server.name);
      setImgUrl(server.img || '');
    }
  }, [server]);

  if (!isOpen || !server || !user) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update({ name, img: imgUrl || null })
        .eq('id', server.id);

      if (error) throw error;

      setServers(servers.map(s => s.id === server.id ? { ...s, name, img: imgUrl || null } : s));
      onClose();
    } catch (error: any) {
      console.error('Error updating server:', error);
      alert('Error updating server: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this server? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', server.id);

      if (error) throw error;

      setServers(servers.filter(s => s.id !== server.id));
      setActiveServer('@me');
      onClose();
    } catch (error: any) {
      console.error('Error deleting server:', error);
      alert('Error deleting server: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-[#1A1B26] w-full max-w-md rounded-xl shadow-2xl border border-[#20212B] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Server Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-[#13141C] border-2 border-[#20212B] flex items-center justify-center overflow-hidden">
                  {imgUrl ? (
                    <img src={imgUrl} alt="Server Icon" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-white font-bold">{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Server Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#13141C] text-white px-4 py-3 rounded-lg border border-[#20212B] focus:border-[#7038fa] focus:outline-none transition-colors"
                placeholder="Enter server name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Server Image URL
              </label>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="w-full bg-[#13141C] text-white px-4 py-3 rounded-lg border border-[#20212B] focus:border-[#7038fa] focus:outline-none transition-colors"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#13141C] p-4 flex items-center justify-between border-t border-[#20212B]">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete Server
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white hover:underline transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="flex items-center gap-2 bg-[#7038fa] hover:bg-[#5b2bd1] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
