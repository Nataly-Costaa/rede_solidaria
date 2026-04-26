import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const REDIRECT = {
  admin: '/admin/usuarios',
  coordenador: '/coordenador/necessidades',
  voluntario: '/voluntario/doacoes',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.senha);
      navigate(REDIRECT[user.tipo] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-deco">
        <div className="deco-ring r1" />
        <div className="deco-ring r2" />
        <div className="deco-ring r3" />
      </div>

      <div className="login-card animate-in">
        <div className="login-header">
          <span className="login-icon">⬡</span>
          <h1>Entrar</h1>
          <p>Acesse o painel de controle da <strong>Rede Solidária</strong></p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        <p className="login-footer">
          <Link to="/">← Ver pontos de coleta</Link>
        </p>
      </div>
    </div>
  );
}
