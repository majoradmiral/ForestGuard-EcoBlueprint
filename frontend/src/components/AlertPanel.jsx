import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const alerts = [
  { id: 1, region: 'Nyambene Hills', severity: 'critical', icon: '🪓', msg: 'Meru Oak logging accelerating — 410 trees lost in organized syndicate operation' },
  { id: 2, region: 'Mau Forest Complex', severity: 'high', icon: '🌙', msg: 'Night logging detected — 340 Prunus africana trees felled in 48h' },
  { id: 3, region: 'Arabuko-Sokoke', severity: 'high', icon: '🗿', msg: 'Muhuhu poaching surge — 280 trees lost to carving trade syndicates' },
  { id: 4, region: 'Tsavo Ecosystem', severity: 'high', icon: '🔥', msg: 'Wildfire in Acacia woodland — 230 trees affected, 12ha burned' },
  { id: 5, region: 'Mt. Kenya Forest', severity: 'critical', icon: '⛓️', msg: 'Large-scale illegal timber syndicate — 520 trees, 8ha cleared' },
]

const severityColor = { critical: '#ff4444', high: 'var(--red-400)', medium: 'var(--red-300)', low: 'var(--green-300)' }

export default function AlertPanel() {
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(new Set())

  if (!visible) return null

  const active = alerts.filter(a => !dismissed.has(a.id))
  if (active.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      maxWidth: 400, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {active.map(a => (
        <div key={a.id} style={{
          background: a.severity === 'critical' ? '#2a0505' : 'var(--gray-800)',
          border: `1px solid ${severityColor[a.severity]}`,
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: 18 }}>{a.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: severityColor[a.severity], marginBottom: 2 }}>{a.region}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-300)' }}>{a.msg}</div>
          </div>
          <button onClick={() => setDismissed(new Set([...dismissed, a.id]))}
            style={{ background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', padding: 2 }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
