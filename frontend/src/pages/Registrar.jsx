import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registrar() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await registrar(nome, email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível criar sua conta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-central">
      <div className="cartao formulario-largura" style={{ width: '100%' }}>
        <h1>Cadastro de morador</h1>
        <p>Crie sua conta para relatar o que você viu ou ouviu na floresta.</p>

        {erro && <div className="erro-formulario">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
          </div>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@littleville.com" />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Pelo menos 6 caracteres" />
          </div>
          <button type="submit" className="botao botao-primario" style={{ width: '100%' }} disabled={enviando}>
            {enviando ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center' }}>
          Já é cadastrado? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
