const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Need to inject supabase imports and logic for friends
content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { supabase } from '../lib/supabase';\nimport { useApp } from '../AppContext';"
);

// We should replace the mocked state in HomeMain with real ones. Let's do it using a regex or simple string replacement.
const stateReplacement = `
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add_friend'>('online');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  type FriendRequest = { id: string; sender_username: string; sender_avatar: string; receiver_username: string; status: string; };
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchRequests = async () => {
      const { data: sent } = await supabase.from('friend_requests').select('*').eq('sender_username', user.name).eq('status', 'pending');
      const { data: received } = await supabase.from('friend_requests').select('*').eq('receiver_username', user.name).eq('status', 'pending');
      if (sent) setSentRequests(sent);
      if (received) setReceivedRequests(received);
    };

    fetchRequests();

    const channel = supabase.channel('public:friend_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addFriendInput.trim() && user) {
      const newReq = {
        id: Date.now().toString(),
        sender_username: user.name,
        sender_avatar: user.avatar,
        receiver_username: addFriendInput.trim(),
        status: 'pending'
      };
      
      // Opt UI
      setSentRequests(prev => [...prev, newReq]);
      setSuccessMessage(\`Success! Your friend request to \${addFriendInput} was sent.\`);
      setAddFriendInput('');
      setTimeout(() => setSuccessMessage(''), 3000);

      await supabase.from('friend_requests').insert([newReq]);
    }
  };

  const cancelRequest = async (id: string) => {
    setSentRequests(prev => prev.filter(r => r.id !== id));
    await supabase.from('friend_requests').delete().eq('id', id);
  };

  const acceptRequest = async (id: string) => {
    setReceivedRequests(prev => prev.filter(r => r.id !== id));
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', id);
  };

  const declineRequest = async (id: string) => {
    setReceivedRequests(prev => prev.filter(r => r.id !== id));
    await supabase.from('friend_requests').delete().eq('id', id);
  };
`;

content = content.replace(
  /const \[activeTab[\s\S]*?const declineRequest =.*?};/s,
  stateReplacement.trim()
);

// We need to change req.username to use sender_username or receiver_username appropriately in the render
content = content.replace(
  /req\.username/g,
  "(req as any).sender_username === user?.name ? (req as any).receiver_username : (req as any).sender_username"
);
content = content.replace(
  /req\.avatar/g,
  "(req as any).sender_username === user?.name ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${(req as any).receiver_username}` : (req as any).sender_avatar"
);

fs.writeFileSync('src/components/HomeView.tsx', content);
