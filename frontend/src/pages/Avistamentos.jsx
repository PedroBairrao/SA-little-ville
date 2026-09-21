import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SeloStatus from '../components/SeloStatus.jsx';
import { useAuth } from '../context/AuthContext';

export default function Avistamentos() {
  const { usuario } = useAuth();
  const [avistamentos, setAvistamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const params = {};
      if (busca) params.busca = busca;
      if (status) params.status = status;
      const { data } = await api.get('/avistamentos', { params });
      setAvistamentos(data.avistamentos);
    } catch (err) {
      setErro('Não foi possível carregar os avistamentos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const debounce = setTimeout(carregar, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, status]);

  async function handleExcluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este relato?')) return;
    try {
      await api.delete(`/avistamentos/${id}`);
      setAvistamentos((atual) => atual.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.erro || 'Não foi possível excluir o relato.');
    }
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <div>
          <h1>Avistamentos</h1>
          <p>Todos os relatos enviados pelos moradores de Little Ville.</p>
        </div>
        <Link to="/avistamentos/novo" className="botao botao-primario">Registrar avistamento</Link>
      </div>

      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Buscar por criatura, local ou descrição…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="descartado">Descartado</option>
        </select>
      </div>

      {erro && <div className="erro-formulario">{erro}</div>}

      {carregando ? (
        <p>Consultando os arquivos da vila…</p>
      ) : avistamentos.length === 0 ? (
        <div className="vazio">Nenhum avistamento encontrado com esses filtros.</div>
      ) : (
        <div className="grade grade-2">
          {avistamentos.map((a) => (
            <div key={a.id} className="cartao-relato">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span className="id-caso">CASO #{String(a.id).padStart(4, '0')}</span>
                <SeloStatus status={a.status} />
              </div>
              <h3 style={{ margin: 0 }}>{a.criatura}</h3>
              <p style={{ margin: 0 }}>{a.localizacao}</p>
              <p style={{ margin: 0, color: 'var(--cor-texto-suave)' }}>
                {a.descricao.length > 120 ? `${a.descricao.slice(0, 120)}…` : a.descricao}
              </p>
              <div className="item-recente-meta">
                {new Date(a.dataHoraOcorrencia).toLocaleString('pt-BR')} · relatado por {a.autor?.nome}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <Link to={`/avistamentos/${a.id}`} className="botao botao-secundario">Ver detalhes</Link>
                {(usuario?.id === a.userId || usuario?.papel === 'administrador') && (
                  <>
                    <Link to={`/avistamentos/${a.id}/editar`} className="botao botao-secundario">Editar</Link>
                    <button type="button" className="botao botao-perigo" onClick={() => handleExcluir(a.id)}>Excluir</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
