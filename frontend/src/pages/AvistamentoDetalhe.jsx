import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import SeloStatus from '../components/SeloStatus.jsx';
import { useAuth } from '../context/AuthContext';

export default function AvistamentoDetalhe() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [avistamento, setAvistamento] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/avistamentos/${id}`)
      .then(({ data }) => setAvistamento(data.avistamento))
      .catch(() => setErro('Este relato não foi encontrado nos arquivos da vila.'));
  }, [id]);

  async function handleExcluir() {
    if (!window.confirm('Tem certeza que deseja excluir este relato?')) return;
    await api.delete(`/avistamentos/${id}`);
    navigate('/avistamentos');
  }

  if (erro) return <div className="erro-formulario">{erro}</div>;
  if (!avistamento) return <p>Carregando relato…</p>;

  const podeGerenciar = usuario?.id === avistamento.userId || usuario?.papel === 'administrador';

  return (
    <div className="formulario-largura">
      <Link to="/avistamentos">&larr; Voltar aos avistamentos</Link>

      <div className="cartao" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="id-caso">CASO #{String(avistamento.id).padStart(4, '0')}</span>
          <SeloStatus status={avistamento.status} />
        </div>

        <h1>{avistamento.criatura}</h1>
        <p><strong>Local:</strong> {avistamento.localizacao}</p>
        <p><strong>Quando:</strong> {new Date(avistamento.dataHoraOcorrencia).toLocaleString('pt-BR')}</p>
        <p><strong>Credibilidade:</strong> {avistamento.nivelCredibilidade}</p>
        <p><strong>Relatado por:</strong> {avistamento.autor?.nome}</p>

        <h3>Descrição</h3>
        <p>{avistamento.descricao}</p>

        {avistamento.imagemUrl && (
          <img
            src={avistamento.imagemUrl}
            alt={`Registro visual do avistamento: ${avistamento.criatura}`}
            style={{ width: '100%', borderRadius: 'var(--raio)', marginTop: 10, border: '1px solid var(--cor-borda)' }}
          />
        )}

        {podeGerenciar && (
          <div className="rodape-form">
            <button type="button" className="botao botao-perigo" onClick={handleExcluir}>Excluir</button>
            <Link to={`/avistamentos/${avistamento.id}/editar`} className="botao botao-primario">Editar</Link>
          </div>
        )}
      </div>
    </div>
  );
}
