import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour le contexte d'authentification
interface User {
  id: string;
  role: string;
  name: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (roleId: string) => void;
  logout: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration des utilisateurs par rôle (données simulées)
const mockUsers = {
  admin: {
    id: 'admin-001',
    role: 'admin',
    name: 'Jean Kamga',
    initials: 'JK'
  },
  doctor: {
    id: 'doctor-001',
    role: 'doctor',
    name: 'Dr. Marie Tamo',
    initials: 'MT'
  },
  nurse: {
    id: 'nurse-001',
    role: 'nurse',
    name: 'Paul Etoa',
    initials: 'PE'
  },
  secretary_primary: {
    id: 'secretary-primary-001',
    role: 'secretary_primary',
    name: 'Sophie Priso',
    initials: 'SP'
  },
  secretary_secondary: {
    id: 'secretary-secondary-001',
    role: 'secretary_secondary',
    name: 'Sara Simo',
    initials: 'SS'
  }
};

// Provider du contexte
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (roleId: string) => {
    const userData = mockUsers[roleId as keyof typeof mockUsers];
    if (userData) {
      setUser(userData);
      // Optionnel : sauvegarder en localStorage pour persistence
      localStorage.setItem('eagleUser', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eagleUser');
  };

  // Initialisation depuis le localStorage au chargement
  React.useEffect(() => {
    const savedUser = localStorage.getItem('eagleUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('eagleUser');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;