import { useEffect, useState } from 'react';
import { getNecessidadesPorPonto, postNecessidade } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusTag, ProgressBar } from '../../components/DoacaoCard';
import '../../components/DoacaoCard.css';
import '../admin/AdminPage.css';
import './CoordenadorPage.css';

export default function CoordenadorNecessidades() {
  const { usuario } = useAuth();
  const [necessidades, setNecessidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item_id: '', quantidade_necessaria: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Items são carregados a partir das próprias necessidades existentes
  // Para criar novas, o coordenador informa o item_id manualmente
  const fetchNecessidades = async () => {
    setLoading(true);
    try {
      const res = await getNecessidadesPorPonto(usuario.ponto_id);
      setNecessidades(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNecessidades(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await postNecessidade({
        ponto_id: usuario.ponto_id,
        item_id: Number(form.item_id),
        quantidade_necessaria: Number(form.quantidade_necessaria),
      });
      setSuccess('Necessidade registrada!');
      setForm({ item_id: '', quantidade_necessaria: '' });
      setShowForm(false);
      fetchNecessidades();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar necessidade');
    }
  };

  return (
    <div className="admin-page animate-in">
      <div className="page-header">
        <div>
          <h2>Necessidades do Ponto</h2>
          <p className="page-sub">Ponto #{usuario.ponto_id} • {necessidades.length} itens monitorados</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nova Necessidade'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card form-card animate-in">
          <h3>Registrar Necessidade</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Informe o ID do item (cadastrado pelo admin) e a quantidade necessária.
          </p>
          <form onSubmit={handleSubmit} className="inline-form">
            <div className="field">
              <label>ID do Item</label>
              <input
                type="number"
                min="1"
                value={form.item_id}
                onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                required
                placeholder="Ex: 1, 2, 3..."
              />
            </div>
            <div className="field">
              <label>Quantidade necessária</label>
              <input
                type="number"
                min="1"
                value={form.quantidade_necessaria}
                onChange={(e) => setForm({ ...form, quantidade_necessaria: e.target.value })}
                required
                placeholder="Ex: 100"
              />
            </div>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="table-loading loading" />
      ) : necessidades.length === 0 ? (
        <div className="empty-state-card card">
          <p>Nenhuma necessidade registrada ainda.</p>
          <p className="muted-small">Use o botão acima para adicionar itens necessários.</p>
        </div>
      ) : (
        <div className="necessidades-grid">
          {necessidades.map((n, i) => (
            <div key={i} className="card nec-card animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="nec-header">
                <p className="nec-item">{n.item}</p>
                <StatusTag status={n.status} />
              </div>
              <ProgressBar percent={n.percentual_atendido} status={n.status} />
              <div className="nec-stats">
                <span>{n.total_recebido} / {n.quantidade_necessaria}</span>
                <span className="pct-label">{n.percentual_atendido}%</span>
                <span>{n.quantidade_faltante > 0 ? `faltam ${n.quantidade_faltante}` : 'completo'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
