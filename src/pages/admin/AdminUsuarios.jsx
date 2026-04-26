import { useEffect, useState } from 'react';
import { getUsuarios, postUsuario, deleteUsuario, getPontos } from '../../services/api';
import './AdminPage.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'voluntario', ponto_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([
        getUsuarios({ tipo: filtroTipo || undefined }),
        getPontos(),
      ]);
      setUsuarios(uRes.data.data || []);
      setPontos(pRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filtroTipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        ...form,
        ponto_id: form.tipo !== 'admin' ? Number(form.ponto_id) : undefined,
      };
      await postUsuario(payload);
      setSuccess('Usuário criado com sucesso!');
      setForm({ nome: '', email: '', senha: '', tipo: 'voluntario', ponto_id: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar este usuário?')) return;
    try {
      await deleteUsuario(id);
      setSuccess('Usuário removido.');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao deletar');
    }
  };

  return (
    <div className="admin-page animate-in">
      <div className="page-header">
        <div>
          <h2>Usuários</h2>
          <p className="page-sub">{usuarios.length} cadastrados</p>
        </div>
        <div className="header-actions">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ width: 'auto' }}>
            <option value="">Todos os tipos</option>
            <option value="admin">Admin</option>
            <option value="coordenador">Coordenador</option>
            <option value="voluntario">Voluntário</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancelar' : '+ Novo Usuário'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card form-card animate-in">
          <h3>Novo Usuário</h3>
          <form onSubmit={handleSubmit} className="inline-form">
            <div className="field">
              <label>Nome</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required minLength={6} />
            </div>
            <div className="field">
              <label>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="voluntario">Voluntário</option>
                <option value="coordenador">Coordenador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {form.tipo !== 'admin' && (
              <div className="field">
                <label>Ponto de Coleta</label>
                <select value={form.ponto_id} onChange={(e) => setForm({ ...form, ponto_id: e.target.value })} required>
                  <option value="">Selecione...</option>
                  {pontos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
            )}
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="table-loading loading" />
      ) : (
        <div className="table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Ponto</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const ponto = pontos.find((p) => p.id === u.ponto_id);
                return (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td className="muted">{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.tipo}`}>{u.tipo}</span>
                    </td>
                    <td className="muted">{ponto?.nome || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {usuarios.length === 0 && <p className="table-empty">Nenhum usuário encontrado.</p>}
        </div>
      )}
    </div>
  );
}
