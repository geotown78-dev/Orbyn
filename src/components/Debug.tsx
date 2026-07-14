import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../AppContext';

export const DebugInfo = () => {
  const { user } = useApp();
  const [log, setLog] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      const { data: m, error: me } = await supabase.from('server_members').select('*').eq('user_id', user.id);
      const { data: s, error: se } = await supabase.from('servers').select('*');
      setLog([{ members: m, membersError: me }, { servers: s, serversError: se }]);
    };
    run();
  }, [user]);

  if (!user) return null;
  return <div className="absolute bottom-0 left-0 bg-black text-white text-[10px] z-50 p-2 max-w-full overflow-auto">
    <pre>{JSON.stringify(log, null, 2)}</pre>
  </div>;
};
