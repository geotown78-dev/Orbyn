import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./lib/supabase";

type User = {
  id: string;
  name: string;
  avatar: string;
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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultServers = [
  { id: 'gamehub', name: 'GameHub', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=100&h=100', isOwner: false },
  { id: 'orbyn', name: 'Orbyn Official', img: null, isOwner: true }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(() => localStorage.getItem('activeChannel') || 'general');
  const [activeServer, setActiveServer] = useState(() => localStorage.getItem('activeServer') || 'gamehub');
  const [user, setUser] = useState<User | null>(null);
  
  const [servers, setServers] = useState<Server[]>(() => {
    const saved = localStorage.getItem('servers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultServers;
      }
    }
    return defaultServers;
  });
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeChannel', activeChannel);
    localStorage.setItem('activeServer', activeServer);
    localStorage.setItem('servers', JSON.stringify(servers));
    
    if (user && isDataLoaded) {
      supabase.from('user_settings').upsert({
        user_id: user.id,
        servers: servers,
        active_server: activeServer,
        active_channel: activeChannel,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error && error.code !== '42P01') console.error("Error saving settings to Supabase:", error);
      });
    }
  }, [activeChannel, activeServer, servers, user, isDataLoaded]);

  useEffect(() => {
    const fetchSettings = async (userId: string) => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        setServers(data.servers);
        setActiveServer(data.active_server);
        setActiveChannel(data.active_channel);
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
        setServers(defaultServers);
        setActiveServer('gamehub');
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
      servers, setServers
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
