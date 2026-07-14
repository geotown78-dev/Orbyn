const fs = require('fs');
let code = fs.readFileSync('src/components/Chat.tsx', 'utf8');

if (!code.includes("import { ServerInviteCard }")) {
    code = code.replace("import { supabase } from '../lib/supabase';", "import { supabase } from '../lib/supabase';\nimport { ServerInviteCard } from './ServerInviteCard';");
}

code = code.replace(
    /<p className="text-gray-300 text-\[15px\] leading-relaxed mb-3">\{msg\.content\}<\/p>/g,
    `{(() => {
                const isInvite = msg.content.startsWith(window.location.origin + '/server_');
                const serverId = isInvite ? msg.content.split('/').pop() : null;
                return (
                  <>
                    <p className="text-gray-300 text-[15px] leading-relaxed mb-1">
                      {isInvite ? 'Sent an invite to join a server.' : msg.content}
                    </p>
                    {isInvite && serverId && (
                      <ServerInviteCard serverId={serverId} />
                    )}
                  </>
                );
              })()}`
);

fs.writeFileSync('src/components/Chat.tsx', code);
console.log("Patched Chat.tsx with ServerInviteCard");
