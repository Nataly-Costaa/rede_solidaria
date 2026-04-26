import { useEffect, useState } from 'react';
import { getPontos, postPonto } from '../../services/api';
import './AdminPage.css';

export default function AdminPontos() {
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', endereco: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPontos = async () => {
    setLoading(true);
    try {
      const res = await getPontos();
      setPontos(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPontos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await postPonto(form);
      setSuccess('Ponto criado com sucesso!');
      setForm({ nome: '', endereco: '' });
      setShowForm(false);
      fetchPontos();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar ponto');
    }
  };

  return (
    <div className="admin-page animate-in">
      <div className="page-header">
        <div>
          <h2>Pontos de Coleta</h2>
          <p className="page-sub">{pontos.length} pontos ativos</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Novo Ponto'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card form-card animate-in">
          <h3>Novo Ponto de Coleta</h3>
          <form onSubmit={handleSubmit} className="inline-form">
            <div className="field">
              <label>Nome do ponto</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Ex: Ponto Central" />
            </div>
            <div className="field">
              <label>Endereço</label>
              <input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} required placeholder="Rua, número, bairro..." />
            </div>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="table-loading loading" />
      ) : (
        <div className="pontos-grid">
          {pontos.map((p) => (
            <div key={p.id} className="card ponto-card animate-in">
              <div className="ponto-icon">📍</div>
              <div>
                <p className="ponto-nome">{p.nome}</p>
                <p className="ponto-end">{p.endereco}</p>
              </div>
            </div>
          ))}
          {pontos.length === 0 && <p className="table-empty">Nenhum ponto cadastrado.</p>}
        </div>
      )}
    </div>
  );
}
