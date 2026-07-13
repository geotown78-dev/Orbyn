import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./lib/supabase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Friend = {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
};

type Server = {
  id: string;
  name: string;
  img: string | null;
  isOwner?: boolean;
};

type AppContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (val: boolean) => void;
  activeChannel: string;
  setActiveChannel: (val: string) => void;
  activeServer: string;
  setActiveServer: (val: string) => void;
  user: User | null;
  servers: Server[];
  setServers: (servers: Server[]) => void;
  pendingRequestsCount: number;
  friends: Friend[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeServer, setActiveServer] = useState('@me');
  const [user, setUser] = useState<User | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);
  
  const [servers, setServers] = useState<Server[]>([]);
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (user && isDataLoaded) {
      supabase.from('user_settings').upsert({
        user_id: user.id,
        username: user.name,
        avatar: user.avatar,
        active_server: activeServer,
        active_channel: activeChannel,
        updated_at: new Date().toISOString()
      }).select().single().then(({ error }) => {
        if (error && error.code !== '42P01') {
          console.error("Error saving settings to Supabase:", error);
        }
      });
    }
  }, [activeChannel, activeServer, servers, user, isDataLoaded]);

  useEffect(() => {
    if (!user) return;

    const fetchPendingCountAndFriends = async () => {
      const { count, error } = await supabase
        .from('friend_requests')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_username', user.name)
        .eq('status', 'pending');
        
      if (!error && count !== null) {
        setPendingRequestsCount(count);
      }

      const { data: sentAccepted } = await supabase.from('friend_requests').select('*').eq('sender_username', user.name).eq('status', 'accepted');
      const { data: receivedAccepted } = await supabase.from('friend_requests').select('*').eq('receiver_username', user.name).eq('status', 'accepted');
      
      const combined = [];
      if (sentAccepted) {
        combined.push(...sentAccepted.map((req: any) => ({
          id: req.id,
          username: req.receiver_username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.receiver_username}`,
          status: 'online' as const
        })));
      }
      if (receivedAccepted) {
        combined.push(...receivedAccepted.map((req: any) => ({
          id: req.id,
          username: req.sender_username,
          avatar: req.sender_avatar,
          status: 'online' as const
        })));
      }
      setFriends(combined);
    };

    fetchPendingCountAndFriends();

    const channel = supabase.channel('global:friend_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, () => {
        fetchPendingCountAndFriends();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const fetchSettings = async (userId: string) => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        setActiveServer(data.active_server);
        setActiveChannel(data.active_channel);
      }
      
      const { data: memberData, error: memberError } = await supabase
        .from('server_members')
        .select('server_id, role')
        .eq('user_id', userId);
        
      if (memberError) {
        console.error('Fetch members error:', memberError);
        alert('Fetch members error: ' + memberError.message);
      }
        
      if (memberData && memberData.length > 0) {
        const serverIds = memberData.map((m: any) => m.server_id);
        const { data: serversData, error: serversError } = await supabase
          .from('servers')
          .select('*')
          .in('id', serverIds);

        if (serversError) {
          console.error('Fetch servers error:', serversError);
          alert('Fetch servers error: ' + serversError.message);
        }

        if (serversData) {
          const dbServers = serversData.map((s: any) => {
            const member = memberData.find((m: any) => m.server_id === s.id);
            return {
              id: s.id,
              name: s.name,
              img: s.img,
              isOwner: member?.role === 'owner'
            };
          });
          setServers(dbServers);
        }
      } else if (memberData && memberData.length === 0) {
        setServers([]);
      }
      
      setIsDataLoaded(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.user_metadata.username || session.user.id}`
        });
        fetchSettings(session.user.id);
      } else {
        setIsDataLoaded(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.user_metadata.username || session.user.id}`
        });
        fetchSettings(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setServers([]);
        setActiveServer('@me');
        setActiveChannel('general');
        setIsDataLoaded(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      isSettingsOpen, setSettingsOpen,
      activeChannel, setActiveChannel,
      activeServer, setActiveServer,
      user,
      servers, setServers,
      pendingRequestsCount,
      friends
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
