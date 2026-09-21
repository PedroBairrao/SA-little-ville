import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-interno">
        <div className="marca">
          <span className="lanterna">◆</span> Little Ville <small>Registro de Avistamentos</small>
        </div>

        {usuario && (
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' ativo' : ''}`}>
              Painel
            </NavLink>
            <NavLink to="/avistamentos" className={({ isActive }) => `nav-link${isActive ? ' ativo' : ''}`}>
              Avistamentos
            </NavLink>
            <NavLink to="/avistamentos/novo" className={({ isActive }) => `nav-link${isActive ? ' ativo' : ''}`}>
              Registrar
            </NavLink>
          </nav>
        )}

        {usuario ? (
          <div className="nav-usuario">
            <span>{usuario.nome}</span>
            <button type="button" className="botao botao-secundario" onClick={handleSair}>Sair</button>
          </div>
        ) : (
          <div className="nav-usuario">
            <NavLink to="/login" className="nav-link">Entrar</NavLink>
            <NavLink to="/registrar" className="botao botao-primario">Cadastrar</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
