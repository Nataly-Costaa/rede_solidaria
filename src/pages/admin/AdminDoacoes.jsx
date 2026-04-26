import { useEffect, useState } from 'react';
import { getDoacoes } from '../../services/api';
import { DoacaoCard } from '../../components/DoacaoCard';
import '../../components/DoacaoCard.css';
import './AdminPage.css';

export default function AdminDoacoes() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoacoes()
      .then((r) => setDados(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    urgente: dados.filter((d) => d.status === 'urgente').length,
    moderado: dados.filter((d) => d.status === 'moderado').length,
    suficiente: dados.filter((d) => d.status === 'suficiente').length,
    total: dados.length,
  };

  return (
    <div className="admin-page animate-in">
      <div className="page-header">
        <div>
          <h2>Visão Geral de Doações</h2>
          <p className="page-sub">Status de todos os pontos</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Itens monitorados</span>
        </div>
        <div className="stat-card card stat-urgente">
          <span className="stat-value">{stats.urgente}</span>
          <span className="stat-label">Urgentes</span>
        </div>
        <div className="stat-card card stat-moderado">
          <span className="stat-value">{stats.moderado}</span>
          <span className="stat-label">Moderados</span>
        </div>
        <div className="stat-card card stat-ok">
          <span className="stat-value">{stats.suficiente}</span>
          <span className="stat-label">Suficientes</span>
        </div>
      </div>

      {loading ? (
        <div className="table-loading loading" />
      ) : (
        <div className="cards-grid">
          {dados.map((d, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.03}s` }}>
              <DoacaoCard item={d} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
