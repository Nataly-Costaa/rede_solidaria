import { useEffect, useState } from 'react';
import { getDoacoes } from '../services/api';
import { DoacaoCard } from '../components/DoacaoCard';
import '../components/DoacaoCard.css';
import './PublicPage.css';

export default function PublicPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    getDoacoes()
      .then((r) => setDados(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtrado = dados.filter((d) => {
    const matchFiltro = filtro === 'todos' || d.status === filtro || (filtro === 'sem necessidade' && d.status === 'sem necessidade');
    const matchBusca = busca === '' ||
      d.ponto?.toLowerCase().includes(busca.toLowerCase()) ||
      d.item?.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const urgentes = dados.filter(d => d.status === 'urgente').length;

  return (
    <div className="public-page">
      <div className="public-hero">
        <div className="hero-badge">⬡ Sistema de Doações</div>
        <h1>Onde sua doação<br /><span className="hero-accent">mais importa</span></h1>
        <p className="hero-sub">
          Veja em tempo real o que cada ponto de coleta precisa.<br />
          Escolha um ponto, leve sua doação, faça a diferença.
        </p>
        {urgentes > 0 && (
          <div className="urgency-banner">
            <span className="urgency-dot" />
            <strong>{urgentes}</strong> {urgentes === 1 ? 'item precisa' : 'itens precisam'} de atenção urgente
          </div>
        )}
      </div>

      <div className="filters-row">
        <input
          type="text"
          placeholder="Buscar ponto ou item..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
        <div className="filter-pills">
          {['todos', 'urgente', 'moderado', 'suficiente'].map((f) => (
            <button
              key={f}
              className={`filter-pill ${filtro === f ? 'active' : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid-skeleton">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card skeleton-card loading" />
          ))}
        </div>
      ) : filtrado.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrado.map((d, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.04}s` }}>
              <DoacaoCard item={d} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
