import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export const InviteModal = ({ isOpen, onClose, serverId }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/${serverId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-[#1A1B26] w-full max-w-md rounded-xl shadow-2xl border border-[#20212B] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Invite Friends</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Send a server invite link to a friend
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-[#13141C] text-white px-4 py-3 rounded-lg border border-[#20212B] focus:outline-none focus:border-[#7038fa] transition-colors"
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#7038fa] hover:bg-[#5b2bd1] text-white'}`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your invite link will never expire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
