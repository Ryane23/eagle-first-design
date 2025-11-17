import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  user: {
    id: string;
    name: string;
    role: string;
    initials: string;
  } | null;
  currentCenter: {
    name: string;
    code: string;
    type: string;
  } | null;
  notifications: number;
  darkMode: boolean;
  isOnline: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_CENTER'; payload: AppState['currentCenter'] }
  | { type: 'SET_NOTIFICATIONS'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean };

const initialState: AppState = {
  user: null,
  currentCenter: null,
  notifications: 0,
  darkMode: false,
  isOnline: true
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CENTER':
      return { ...state, currentCenter: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};