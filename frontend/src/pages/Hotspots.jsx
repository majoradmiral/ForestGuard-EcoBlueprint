import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Flame, AlertTriangle, TreePine, BarChart3, Clock, MapPin } from 'lucide-react'
import MapLegend from '../components/MapLegend'
import regions from '../data/regions'

const allHotspots = [
  { id:1,region:"Mau Forest",lat:-0.48,lng:35.28,cause:"illegal",severity:"high",trees:340,date:"2026-06-14",desc:"Night logging operation detected in Prunus africana stand",status:"active" },
  { id:2,region:"Mau Forest",lat:-0.55,lng:35.32,cause:"disease",severity:"high",trees:180,date:"2026-06-10",desc:"Fungal infection spreading in Prunus africana population",status:"active" },
  { id:3,region:"Mt. Kenya",lat:-0.18,lng:37.48,cause:"illegal",severity:"critical",trees:520,date:"2026-06-12",desc:"Large-scale illegal timber syndicate — Vitex keniensis targeted",status:"active" },
  { id:4,region:"Mt. Kenya",lat:-0.22,lng:37.52,cause:"fire",severity:"medium",trees:90,date:"2026-06-08",desc:"Surface fire in lower montane zone",status:"contained" },
  { id:5,region:"Kakamega",lat:0.48,lng:34.78,cause:"legal",severity:"low",trees:60,date:"2026-06-15",desc:"Licensed harvesting plot KMG-04 — Croton megalocarpus",status:"active" },
  { id:6,region:"Kakamega",lat:0.52,lng:34.82,cause:"illegal",severity:"medium",trees:120,date:"2026-06-11",desc:"Charcoal burning site — mixed species",status:"active" },
  { id:7,region:"Karura",lat:-1.18,lng:36.82,cause:"illegal",severity:"medium",trees:85,date:"2026-06-13",desc:"Encroachment on northern boundary — Olea capensis",status:"active" },
  { id:8,region:"Mt. Elgon",lat:1.08,lng:34.58,cause:"legal",severity:"medium",trees:200,date:"2026-06-09",desc:"Government-sanctioned timber harvest — Juniperus procera",status:"completed" },
  { id:9,region:"Arabuko-Sokoke",lat:-3.42,lng:39.48,cause:"illegal",severity:"high",trees:280,date:"2026-06-14",desc:"Muhuhu poaching for carving trade — Brachylaena huillensis",status:"active" },
  { id:10,region:"Nyambene Hills",lat:0.18,lng:38.02,cause:"illegal",severity:"critical",trees:410,date:"2026-06-13",desc:"Meru Oak targeted by organized syndicate",status:"active" },
  { id:11,region:"Mau Forest",lat:-0.52,lng:35.26,cause:"legal",severity:"low",trees:45,date:"2026-06-07",desc:"Licensed exotic plantation harvest",status:"completed" },
  { id:12,region:"Aberdare Range",lat:-0.38,lng:36.72,cause:"disease",severity:"medium",trees:150,date:"2026-06-06",desc:"Root rot affecting Hagenia abyssinica stands",status:"active" },
  { id:13,region:"Tsavo",lat:-2.48,lng:38.02,cause:"fire",severity:"high",trees:230,date:"2026-06-12",desc:"Wildfire in Acacia xanthophloea woodland",status:"active" },
  { id:14,region:"Shimba Hills",lat:-4.18,lng:39.42,cause:"disease",severity:"medium",trees:95,date:"2026-06-05",desc:"Dieback in Brachylaena huillensis",status:"active" },
  { id:15,region:"Mt. Elgon",lat:1.12,lng:34.62,cause:"fire",severity:"high",trees:175,date:"2026-06-11",desc:"Bush fire on eastern slopes",status:"contained" },
  { id:16,region:"Masai Mara",lat:-1.42,lng:35.02,cause:"fire",severity:"medium",trees:80,date:"2026-06-14",desc:"Grassland fire affecting Acacia woodland",status:"active" },
  { id:17,region:"Mt. Kenya",lat:-0.16,lng:37.55,cause:"legal",severity:"low",trees:120,date:"2026-06-04",desc:"Licensed plantation thinning — Podocarpus",status:"completed" },
  { id:18,region:"Mau Forest",lat:-0.45,lng:35.35,cause:"illegal",severity:"high",trees:290,date:"2026-06-15",desc:"Timber convoy intercepted — Olea capensis & Prunus africana",status:"active" },
]

const causeConfig = {
  legal: { color: '#6bcf6b', label: 'Legal Logging', icon: '🪵' },
  illegal: { color: '#e87474', label: 'Illegal Logging', icon: '⛓️' },
  disease: { color: '#e8b84a', label: 'Disease', icon: '🦠' },
  fire: { color: '#e88a4a', label: 'Fire', icon: '🔥' },
}

const severityScale = { critical: 16, high: 12, medium: 8, low: 5 }

export default function Hotspots() {
  const [causeFilter, setCauseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filtered = useMemo(() => {
    let result = [...allHotspots]
    if (causeFilter !== 'all') result = result.filter(h => h.cause === causeFilter)
    if (statusFilter !== 'all') result = result.filter(h => h.status === statusFilter)
    if (sortBy === 'trees') result.sort((a, b) => b.trees - a.trees)
    else result.sort((a, b) => b.date.localeCompare(a.date))
    return result
  }, [causeFilter, statusFilter, sortBy])

  const stats = useMemo(() => {
    const s = { legal: 0, illegal: 0, disease: 0, fire: 0, total: 0 }
    allHotspots.forEach(h => { s[h.cause] += h.trees; s.total += h.trees })
    return s
  }, [])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>EcoBlueprint Hotspots — Live Cutting Monitoring</h1>
        <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
          Every active tree loss event tracked across Kenya · Categorized by cause: legal logging, illegal logging, disease, fire
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {Object.entries(causeConfig).map(([key, cfg]) => (
          <div key={key} style={{
            background: 'var(--card-bg)', border: `1px solid ${cfg.color}33`,
            borderRadius: 10, padding: '14px 16px',
            borderLeft: `3px solid ${cfg.color}`,
          }}>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>{cfg.icon} {cfg.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>{stats[key].toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>trees affected</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--gray-400)', marginRight: 4 }}>Cause:</span>
        {['all', 'legal', 'illegal', 'disease', 'fire'].map(c => (
          <button key={c} onClick={() => setCauseFilter(c)} style={{
            padding: '5px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: causeFilter === c ? (c === 'all' ? 'var(--green-700)' : `${causeConfig[c]?.color}33`) : 'var(--card-bg)',
            color: causeFilter === c ? (c === 'all' ? 'var(--text)' : causeConfig[c]?.color) : 'var(--text)',
            border: causeFilter === c ? `1px solid ${c === 'all' ? 'var(--green-400)' : causeConfig[c]?.color}` : '1px solid var(--border)',
          }}>
            {c === 'all' ? 'All' : causeConfig[c]?.label || c}
          </button>
        ))}

        <span style={{ fontSize: 13, color: 'var(--gray-400)', marginLeft: 16, marginRight: 4 }}>Status:</span>
        {['all', 'active', 'contained', 'completed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: statusFilter === s ? 'var(--green-700)' : 'var(--card-bg)',
            color: 'var(--text)', border: statusFilter === s ? '1px solid var(--green-400)' : '1px solid var(--border)',
          }}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Sort:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: '4px 8px', borderRadius: 6, fontSize: 12,
            background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--border)',
          }}>
            <option value="date">Latest</option>
            <option value="trees">Most trees</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ height: 520 }}>
            <MapContainer center={[0, 37]} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filtered.map(h => (
                <CircleMarker key={h.id} center={[h.lat, h.lng]}
                  radius={severityScale[h.severity] || 8}
                  pathOptions={{
                    color: causeConfig[h.cause]?.color || '#666',
                    fillColor: causeConfig[h.cause]?.color || '#666',
                    fillOpacity: 0.35,
                    weight: 2,
                  }}>
                  <Popup>
                    <div style={{ fontFamily: 'sans-serif', minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{h.region}</div>
                      <div style={{ fontSize: 12, color: causeConfig[h.cause]?.color, marginBottom: 4 }}>
                        ● {causeConfig[h.cause]?.label} · {h.severity.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 12, color: '#555', marginBottom: 2 }}>{h.desc}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        {h.trees} trees · {h.date} · {h.status}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div>
          <MapLegend mode="hotspot" items={Object.entries(causeConfig).map(([k, v]) => ({ label: v.label, color: v.color }))} />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Active Events</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red-300)' }}>
                {filtered.filter(h => h.status === 'active').length}
              </div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Total Trees in View</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-100)' }}>
                {filtered.reduce((sum, h) => sum + h.trees, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)' }}>
            <Flame size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--red-400)' }} />
            Event Log ({filtered.length})
          </h2>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
            {filtered.filter(h => h.status === 'active').length} active · {filtered.filter(h => h.status === 'contained').length} contained · {filtered.filter(h => h.status === 'completed').length} completed
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filtered.map(h => (
            <div key={h.id} style={{
              padding: '12px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: h.status === 'active' ? 'rgba(255,255,255,0.02)' : 'transparent',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${causeConfig[h.cause]?.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>
                {causeConfig[h.cause]?.icon || '🌲'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-100)' }}>{h.region}</span>
                    <span className={`cause-badge ${h.cause}`} style={{ marginLeft: 8 }}>{causeConfig[h.cause]?.label}</span>
                    <span style={{
                      marginLeft: 6, fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: h.status === 'active' ? 'var(--red-900)' : h.status === 'contained' ? '#3a2a1a' : 'var(--green-900)',
                      color: h.status === 'active' ? 'var(--red-300)' : h.status === 'contained' ? '#e8b84a' : 'var(--green-300)',
                    }}>{h.status}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{h.date}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>{h.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                  <strong style={{ color: causeConfig[h.cause]?.color }}>{h.trees}</strong> trees affected · Severity: {h.severity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
