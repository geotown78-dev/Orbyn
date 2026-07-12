import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AppContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (val: boolean) => void;
  activeChannel: string;
  setActiveChannel: (val: string) => void;
  user: User | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.user_metadata.username || session.user.id}`
        });
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
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      isSettingsOpen, setSettingsOpen,
      activeChannel, setActiveChannel,
      user
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

