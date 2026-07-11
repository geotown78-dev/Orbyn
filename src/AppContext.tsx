import { createContext, useContext, useState, ReactNode } from "react";


type User = {
  id: string;
  name: string;
  avatar: string;
};

export const currentUser: User = {
  id: 'u1',
  name: 'OrbynUser',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OrbynUser'
};

type AppContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (val: boolean) => void;
  activeChannel: string;
  setActiveChannel: (val: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      isSettingsOpen, setSettingsOpen,
      activeChannel, setActiveChannel
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
