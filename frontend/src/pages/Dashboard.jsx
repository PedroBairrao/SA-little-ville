import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SeloStatus from '../components/SeloStatus.jsx';

const CORES_STATUS = {
  pendente: '#c98f3a',
  confirmado: '#6fa287',
  descartado: '#c1502e',
};

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data }) => setDados(data))
      .catch(() => setErro('Não foi possível carregar o painel agora.'));
  }, []);

  if (erro) return <div className="erro-formulario">{erro}</div>;
  if (!dados) return <div className="pagina-central">Consultando os registros da vila…</div>;

  const timelineFormatada = dados.timeline.map((d) => ({ ...d, rotulo: formatarData(d.data) }));
  // A API já retorna JSON puro (o Express serializa os models do Sequelize
  // automaticamente), então basta ler os campos diretamente.
  const statusFormatado = dados.porStatus.map((s) => ({
    nome: s.status,
    valor: Number(s.quantidade),
  }));
  const criaturaFormatada = dados.porCriatura.map((c) => ({
    nome: c.criatura,
    valor: Number(c.quantidade),
  }));

  return (
    <div>
      <div className="cabecalho-pagina">
        <div>
          <h1>Painel de Little Ville</h1>
          <p>Visão geral dos relatos enviados pelos moradores.</p>
        </div>
        <Link to="/avistamentos/novo" className="botao botao-primario">Registrar avistamento</Link>
      </div>

      <div className="grade grade-4" style={{ marginBottom: 22 }}>
        <div className="cartao stat">
          <span className="stat-numero">{dados.total}</span>
          <span className="stat-rotulo">Avistamentos registrados</span>
        </div>
        <div className="cartao stat">
          <span className="stat-numero">{dados.totalMoradores}</span>
          <span className="stat-rotulo">Moradores cadastrados</span>
        </div>
        <div className="cartao stat">
          <span className="stat-numero">{statusFormatado.find((s) => s.nome === 'confirmado')?.valor || 0}</span>
          <span className="stat-rotulo">Casos confirmados</span>
        </div>
        <div className="cartao stat">
          <span className="stat-numero">{statusFormatado.find((s) => s.nome === 'pendente')?.valor || 0}</span>
          <span className="stat-rotulo">Aguardando análise</span>
        </div>
      </div>

      <div className="grade grade-2" style={{ marginBottom: 22, alignItems: 'stretch' }}>
        <div className="painel-grafico">
          <h3>Relatos nos últimos 14 dias</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timelineFormatada}>
              <CartesianGrid stroke="#2f4a37" strokeDasharray="3 3" />
              <XAxis dataKey="rotulo" stroke="#8ea08c" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#8ea08c" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1c2f23', border: '1px solid #2f4a37', color: '#eee6d3' }} />
              <Line type="monotone" dataKey="quantidade" stroke="#e8c77e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="painel-grafico">
          <h3>Situação dos casos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusFormatado} dataKey="valor" nameKey="nome" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {statusFormatado.map((entrada) => (
                  <Cell key={entrada.nome} fill={CORES_STATUS[entrada.nome] || '#999'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: '#1c2f23', border: '1px solid #2f4a37', color: '#eee6d3' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grade grade-2" style={{ alignItems: 'stretch' }}>
        <div className="painel-grafico">
          <h3>Criaturas mais relatadas</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={criaturaFormatada} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="#2f4a37" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} stroke="#8ea08c" fontSize={12} />
              <YAxis type="category" dataKey="nome" stroke="#8ea08c" fontSize={12} width={110} />
              <Tooltip contentStyle={{ background: '#1c2f23', border: '1px solid #2f4a37', color: '#eee6d3' }} />
              <Bar dataKey="valor" fill="#d3a44a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="painel-grafico">
          <h3>Relatos mais recentes</h3>
          <div className="lista-recentes">
            {dados.recentes.length === 0 && <p>Nenhum avistamento registrado ainda.</p>}
            {dados.recentes.map((r) => (
              <Link key={r.id} to={`/avistamentos/${r.id}`} className="item-recente" style={{ color: 'inherit' }}>
                <div>
                  <div className="item-recente-titulo">{r.criatura}</div>
                  <div className="item-recente-meta">{r.localizacao} · relatado por {r.autor?.nome}</div>
                </div>
                <SeloStatus status={r.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
