const fs = require('fs');
let code = fs.readFileSync('src/components/InviteModal.tsx', 'utf8');

code = code.replace(
    /\/\/ Add friend to server directly\s+await supabase\.from\('server_members'\)\.insert\(\[\s+\{ server_id: serverId, user_id: friendId, role: 'member' \}\s+\]\);/g,
    `// Send them a DM with the invite link
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
    }]);`
);

fs.writeFileSync('src/components/InviteModal.tsx', code);
console.log("Patched InviteModal logic");
