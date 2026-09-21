import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('lv_usuario');
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lv_token');
    if (!token) {
      setCarregando(false);
      return;
    }
    // Confirma que o token ainda é válido e atualiza os dados do morador.
    api.get('/auth/me')
      .then(({ data }) => {
        setUsuario(data.usuario);
        localStorage.setItem('lv_usuario', JSON.stringify(data.usuario));
      })
      .catch(() => {
        setUsuario(null);
        localStorage.removeItem('lv_token');
        localStorage.removeItem('lv_usuario');
      })
      .finally(() => setCarregando(false));
  }, []);

  function salvarSessao({ usuario: dadosUsuario, token }) {
    localStorage.setItem('lv_token', token);
    localStorage.setItem('lv_usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    salvarSessao(data);
  }

  async function registrar(nome, email, senha) {
    const { data } = await api.post('/auth/registrar', { nome, email, senha });
    salvarSessao(data);
  }

  function sair() {
    localStorage.removeItem('lv_token');
    localStorage.removeItem('lv_usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de um AuthProvider.');
  return contexto;
}
