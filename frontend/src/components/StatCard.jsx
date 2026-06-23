export default function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--gray-100)' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}
