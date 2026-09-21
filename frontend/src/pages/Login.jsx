import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível entrar. Verifique seus dados.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-central">
      <div className="cartao formulario-largura" style={{ width: '100%' }}>
        <h1>Entrar em Little Ville</h1>
        <p>Acesse sua conta de morador para registrar e acompanhar avistamentos.</p>

        {erro && <div className="erro-formulario">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@littleville.com" />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="botao botao-primario" style={{ width: '100%' }} disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center' }}>
          Ainda não é cadastrado? <Link to="/registrar">Crie sua conta</Link>
        </p>
      </div>
    </div>
  );
}
