import { createSignal, createContext, useContext, ParentComponent } from 'solid-js';
import { AuthResponse } from './api';

interface AuthContextType {
  user: () => AuthResponse | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  token: () => string | null;
}

const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<AuthResponse | null>(null);

  const login = (auth: AuthResponse) => {
    setUser(auth);
    localStorage.setItem('staticleaf_auth', JSON.stringify(auth));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('staticleaf_auth');
  };

  const token = () => user()?.token || null;

  // Try to restore from localStorage on init
  try {
    const stored = localStorage.getItem('staticleaf_auth');
    if (stored) {
      const auth = JSON.parse(stored);
      setUser(auth);
    }
  } catch (e) {
    // Ignore
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};