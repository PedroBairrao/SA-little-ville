import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaPrivada({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div className="pagina-central">Carregando…</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
