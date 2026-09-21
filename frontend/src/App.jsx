import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import RotaPrivada from './components/RotaPrivada.jsx';
import Login from './pages/Login.jsx';
import Registrar from './pages/Registrar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Avistamentos from './pages/Avistamentos.jsx';
import AvistamentoForm from './pages/AvistamentoForm.jsx';
import AvistamentoDetalhe from './pages/AvistamentoDetalhe.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="conteudo">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />

          <Route path="/" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
          <Route path="/avistamentos" element={<RotaPrivada><Avistamentos /></RotaPrivada>} />
          <Route path="/avistamentos/novo" element={<RotaPrivada><AvistamentoForm /></RotaPrivada>} />
          <Route path="/avistamentos/:id" element={<RotaPrivada><AvistamentoDetalhe /></RotaPrivada>} />
          <Route path="/avistamentos/:id/editar" element={<RotaPrivada><AvistamentoForm /></RotaPrivada>} />

          <Route path="*" element={<div className="vazio">Página não encontrada nos arquivos de Little Ville.</div>} />
        </Routes>
      </main>
    </div>
  );
}
