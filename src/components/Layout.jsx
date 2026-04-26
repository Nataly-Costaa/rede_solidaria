import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const NAV_LINKS = {
  admin: [
    { to: '/admin/usuarios', label: 'Usuários' },
    { to: '/admin/pontos', label: 'Pontos de Coleta' },
    { to: '/admin/doacoes', label: 'Visão Geral' },
  ],
  coordenador: [
    { to: '/coordenador/necessidades', label: 'Necessidades' },
    { to: '/coordenador/doacoes', label: 'Registrar Doação' },
  ],
  voluntario: [
    { to: '/voluntario/doacoes', label: 'Registrar Doação' },
  ],
};

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = usuario ? NAV_LINKS[usuario.tipo] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="navbar">
        <Link to={usuario ? `/${usuario.tipo}` : '/'} className="brand">
          <span className="brand-icon">⬡</span>
          <span>Rede<strong>Solidária</strong></span>
        </Link>

        <nav className="nav-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {!usuario && (
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Pontos de Coleta
            </Link>
          )}
        </nav>

        <div className="nav-end">
          {usuario ? (
            <>
              <span className="user-badge">
                <span className={`role-dot role-${usuario.tipo}`} />
                {usuario.tipo}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Entrar
            </Link>
          )}
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}
