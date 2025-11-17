import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  center: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (roleId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (roleId: string) => {
    // Utilisateurs simulés selon vos rôles
    const mockUsers: Record<string, User> = {
      'admin': {
        id: '1',
        name: 'Jean Kameni',
        role: 'admin',
        initials: 'JK',
        center: 'Administration Centrale'
      },
      'doctor': {
        id: '2',
        name: 'Dr. Kouam Michel',
        role: 'doctor',
        initials: 'DK',
        center: 'Centre Principal'
      },
      'nurse': {
        id: '3',
        name: 'Anne Biyongo',
        role: 'nurse',
        initials: 'AB',
        center: 'Clinique Saint Jean'
      },
      'secretary_main': {
        id: '4',
        name: 'Marie Kouam',
        role: 'secretary_main',
        initials: 'MK',
        center: 'Centre Principal'
      },
      'secretary_secondary': {
        id: '5',
        name: 'Sara Simo',
        role: 'secretary_secondary',
        initials: 'SS',
        center: 'Clinique Saint Jean'
      }
    };

    setUser(mockUsers[roleId] || null);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};