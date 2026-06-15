export default function MapLegend({ mode, items }) {
  const title = mode === 'region' ? 'Regions'
    : mode === 'habitat' ? 'Habitats'
    : mode === 'education-region' ? 'Region Coloring'
    : mode === 'education-habitat' ? 'Habitat Coloring'
    : 'Causes'

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 12,
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 600, color: 'var(--gray-200)', marginBottom: 8, fontSize: 13 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 14, height: 14, borderRadius: 4,
            background: item.color,
            flexShrink: 0,
          }} />
          <span style={{ color: 'var(--gray-300)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
