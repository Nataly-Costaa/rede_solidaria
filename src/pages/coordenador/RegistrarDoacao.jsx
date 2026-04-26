import { useEffect, useState } from 'react';
import { postDoacao, getDoacoes, getPontos } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusTag, ProgressBar } from '../../components/DoacaoCard';
import '../../components/DoacaoCard.css';
import '../admin/AdminPage.css';
import './CoordenadorPage.css';

export default function RegistrarDoacao() {
  const { usuario } = useAuth();
  const [doacoes, setDoacoes] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    item_id: '',
    ponto_id: usuario.tipo === 'coordenador' ? String(usuario.ponto_id) : '',
    quantidade: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([getDoacoes(), getPontos()]);
      setDoacoes(dRes.data.data || []);
      setPontos(pRes.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Filtro da tabela pelo ponto selecionado ou do coordenador
  const pontoId = usuario.tipo === 'coordenador' ? usuario.ponto_id : Number(form.ponto_id);
  const pontoNecessidades = doacoes.filter(
    (d) => pontos.find((p) => p.nome === d.ponto && p.id === pontoId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSubmitting(true);
    try {
      await postDoacao({
        item_id: Number(form.item_id),
        ponto_id: Number(form.ponto_id),
        quantidade: Number(form.quantidade),
      });
      setSuccess('Doação registrada com sucesso! ✓');
      setForm({ ...form, item_id: '', quantidade: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar doação');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPonto = pontos.find((p) => p.id === pontoId);

  return (
    <div className="admin-page animate-in">
      <div className="page-header">
        <div>
          <h2>Registrar Doação</h2>
          <p className="page-sub">
            {usuario.tipo === 'coordenador'
              ? `Ponto: ${selectedPonto?.nome || '#' + usuario.ponto_id}`
              : 'Selecione o ponto e o item'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="doacao-layout">
        <div className="card form-card-tall">
          <h3>Nova Doação</h3>
          <form onSubmit={handleSubmit} className="tall-form">
            {usuario.tipo !== 'coordenador' && (
              <div className="field">
                <label>Ponto de Coleta</label>
                <select
                  value={form.ponto_id}
                  onChange={(e) => setForm({ ...form, ponto_id: e.target.value })}
                  required
                >
                  <option value="">Selecione o ponto...</option>
                  {pontos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
            )}

            <div className="field">
              <label>ID do Item</label>
              <input
                type="number"
                min="1"
                value={form.item_id}
                onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                required
                placeholder="ID do item doado"
              />
              <span className="field-hint">
                Veja os itens necessários ao lado →
              </span>
            </div>

            <div className="field">
              <label>Quantidade</label>
              <input
                type="number"
                min="1"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                required
                placeholder="Ex: 10"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registrando...' : '✓ Confirmar Doação'}
            </button>
          </form>
        </div>

        <div className="side-panel">
          <p className="side-title">
            {pontoId
              ? `Necessidades: ${selectedPonto?.nome || 'Ponto #' + pontoId}`
              : 'Selecione um ponto para ver as necessidades'}
          </p>
          {loading ? (
            <div className="table-loading loading" style={{ height: 120 }} />
          ) : pontoNecessidades.length > 0 ? (
            <div className="necessidades-list">
              {pontoNecessidades.map((n, i) => (
                <div key={i} className="nec-mini-card card">
                  <div className="nec-mini-top">
                    <span className="nec-mini-item">{n.item}</span>
                    <StatusTag status={n.status} />
                  </div>
                  <ProgressBar percent={n.percentual_atendido} status={n.status} />
                  <p className="nec-mini-nums">
                    {n.total_recebido} / {n.quantidade_necessaria} • faltam {Math.max(0, n.quantidade_faltante)}
                  </p>
                </div>
              ))}
            </div>
          ) : pontoId ? (
            <p className="muted-small">Nenhuma necessidade registrada neste ponto.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
