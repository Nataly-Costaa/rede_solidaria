export function StatusTag({ status }) {
  const labels = {
    urgente: '⚡ Urgente',
    moderado: '◑ Moderado',
    suficiente: '✓ Suficiente',
    sem_necessidade: '— Sem necessidade',
  };
  const key = status?.replace(' ', '_') || 'sem_necessidade';
  return <span className={`tag ${key}`}>{labels[key] || status}</span>;
}

export function ProgressBar({ percent, status }) {
  const colors = {
    urgente: 'var(--red)',
    moderado: 'var(--amber)',
    suficiente: 'var(--green)',
    sem_necessidade: 'var(--text-dim)',
  };
  const key = status?.replace(' ', '_') || 'sem_necessidade';
  const capped = Math.min(Number(percent) || 0, 100);

  return (
    <div className="progress-bar-wrap">
      <div
        className="progress-bar-fill"
        style={{ width: `${capped}%`, background: colors[key] || 'var(--green)' }}
      />
    </div>
  );
}

export function DoacaoCard({ item }) {
  const pct = Number(item.percentual_atendido) || 0;
  const status = item.status?.replace(' ', '_') || 'urgente';

  return (
    <div className="card doacao-card animate-in">
      <div className="doacao-card-header">
        <div>
          <p className="doacao-item-nome">{item.item}</p>
          <p className="doacao-ponto-nome">{item.ponto}</p>
        </div>
        <StatusTag status={item.status} />
      </div>

      <ProgressBar percent={pct} status={item.status} />

      <div className="doacao-stats">
        <span><strong>{item.total_recebido}</strong> recebidos</span>
        <span className="pct-label">{pct}%</span>
        <span><strong>{item.quantidade_faltante > 0 ? item.quantidade_faltante : 0}</strong> faltando</span>
      </div>
    </div>
  );
}
