import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const VAZIO = {
  criatura: '',
  descricao: '',
  localizacao: '',
  dataHoraOcorrencia: '',
  nivelCredibilidade: 'medio',
  status: 'pendente',
  imagemUrl: '',
};

function paraInputDatetime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AvistamentoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(editando);

  useEffect(() => {
    if (!editando) return;
    api.get(`/avistamentos/${id}`)
      .then(({ data }) => {
        const a = data.avistamento;
        setForm({
          criatura: a.criatura,
          descricao: a.descricao,
          localizacao: a.localizacao,
          dataHoraOcorrencia: paraInputDatetime(a.dataHoraOcorrencia),
          nivelCredibilidade: a.nivelCredibilidade,
          status: a.status,
          imagemUrl: a.imagemUrl || '',
        });
      })
      .catch(() => setErro('Não foi possível carregar este avistamento.'))
      .finally(() => setCarregando(false));
  }, [id, editando]);

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      if (editando) {
        await api.put(`/avistamentos/${id}`, form);
        navigate(`/avistamentos/${id}`);
      } else {
        const { data } = await api.post('/avistamentos', form);
        navigate(`/avistamentos/${data.avistamento.id}`);
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível salvar o avistamento.');
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p>Carregando relato…</p>;

  return (
    <div className="formulario-largura">
      <h1>{editando ? 'Editar avistamento' : 'Registrar avistamento'}</h1>
      <p style={{ marginBottom: 20 }}>
        Descreva com o máximo de detalhes o que foi visto, ouvido ou encontrado — isso ajuda a prefeitura a avaliar cada caso.
      </p>

      {erro && <div className="erro-formulario">{erro}</div>}

      <form onSubmit={handleSubmit} className="cartao">
        <div className="campo">
          <label htmlFor="criatura">Criatura ou fenômeno</label>
          <input id="criatura" required value={form.criatura} onChange={(e) => handleChange('criatura', e.target.value)} placeholder="Ex: Pé Grande, Luzes no céu…" />
        </div>

        <div className="campo">
          <label htmlFor="localizacao">Local do avistamento</label>
          <input id="localizacao" required value={form.localizacao} onChange={(e) => handleChange('localizacao', e.target.value)} placeholder="Ex: Trilha da Represa Velha" />
        </div>

        <div className="campo">
          <label htmlFor="dataHoraOcorrencia">Data e hora em que ocorreu</label>
          <input id="dataHoraOcorrencia" type="datetime-local" required value={form.dataHoraOcorrencia} onChange={(e) => handleChange('dataHoraOcorrencia', e.target.value)} />
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição do ocorrido</label>
          <textarea id="descricao" required value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} placeholder="O que você viu, ouviu ou encontrou?" />
        </div>

        <div className="grade grade-2">
          <div className="campo">
            <label htmlFor="nivelCredibilidade">Nível de credibilidade</label>
            <select id="nivelCredibilidade" value={form.nivelCredibilidade} onChange={(e) => handleChange('nivelCredibilidade', e.target.value)}>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
            </select>
          </div>

          {editando && (
            <div className="campo">
              <label htmlFor="status">Status do caso</label>
              <select id="status" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>
          )}
        </div>

        <div className="campo">
          <label htmlFor="imagemUrl">Link de uma foto (opcional)</label>
          <input id="imagemUrl" value={form.imagemUrl} onChange={(e) => handleChange('imagemUrl', e.target.value)} placeholder="https://…" />
        </div>

        <div className="rodape-form">
          <button type="button" className="botao botao-secundario" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="botao botao-primario" disabled={enviando}>
            {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Registrar avistamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
