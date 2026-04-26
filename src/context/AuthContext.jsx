import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const s = localStorage.getItem('usuario');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = async (email, senha) => {
    const res = await loginApi(email, senha);
    const token = res.data.token;
    localStorage.setItem('token', token);

    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = { id: payload.id, tipo: payload.tipo, ponto_id: payload.ponto_id };
    localStorage.setItem('usuario', JSON.stringify(user));
    setUsuario(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
