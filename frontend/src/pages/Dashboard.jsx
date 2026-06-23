import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Trees, AlertTriangle, RefreshCw, Target, Leaf, Bug } from 'lucide-react'
import StatCard from '../components/StatCard'
import species from '../data/kenyaSpecies'

const COLORS = ['#d14a4a', '#e87474', '#e8b84a', '#e88a4a']

const lossByCause = [
  { name: 'Legal', value: 1225, color: '#6bcf6b' },
  { name: 'Illegal', value: 2840, color: '#e87474' },
  { name: 'Disease', value: 865, color: '#e8b84a' },
  { name: 'Fire', value: 530, color: '#e88a4a' },
]

const topSpecies = species
  .sort((a, b) => b.totalLoss - a.totalLoss)
  .slice(0, 6)

const hotspots = [
  { lat: -0.5, lng: 35.3, radius: 15000, severity: 'high', label: 'Mau Forest' },
  { lat: -0.2, lng: 37.5, radius: 12000, severity: 'high', label: 'Mt. Kenya' },
  { lat: 0.5, lng: 34.8, radius: 9000, severity: 'medium', label: 'Kakamega' },
  { lat: -1.2, lng: 36.8, radius: 8000, severity: 'medium', label: 'Karura' },
  { lat: -2.5, lng: 38.0, radius: 10000, severity: 'low', label: 'Tsavo' },
  { lat: -3.4, lng: 39.5, radius: 11000, severity: 'medium', label: 'Arabuko' },
  { lat: 1.1, lng: 34.6, radius: 13000, severity: 'high', label: 'Mt. Elgon' },
]

const severityColors = { high: '#d14a4a', medium: '#e87474', low: '#6bcf6b' }

export default function Dashboard() {
  const totalLoss = 5460
  const endangered = species.filter(s => s.status === 'Endangered' || s.status === 'Vulnerable').length

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>EcoBlueprint Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
          Real-time species-level deforestation tracking · KEFRI data integration · {species.length} species monitored
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Trees} label="Forest Cover" value="5,846 km²" color="#3cb043" sub="Kenya protected forests" />
        <StatCard icon={AlertTriangle} label="Trees Lost (YTD)" value={`${totalLoss.toLocaleString()}`} color="#d14a4a" sub="↑ 18% from last year" />
        <StatCard icon={Leaf} label="Endangered Species" value={endangered.toString()} color="#e8b84a" sub="of 12 tracked" />
        <StatCard icon={RefreshCw} label="Reforested" value="685 ha" color="#6bcf6b" sub="42% native species" />
        <StatCard icon={Bug} label="Disease Outbreaks" value="3 active" color="#e8b84a" sub="Prunus, Hagenia, Brachylaena" />
        <StatCard icon={Target} label="Carbon Sequestered" value="3.5 Kt" color="#58a6ff" sub="CO₂ equivalent" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Deforestation Hotspots — Kenya Forests</h2>
          <div style={{ height: 400, borderRadius: 8, overflow: 'hidden' }}>
            <MapContainer center={[0, 37]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {hotspots.map((h, i) => (
                <CircleMarker key={i} center={[h.lat, h.lng]} radius={h.radius / 2000}
                  pathOptions={{ color: severityColors[h.severity], fillColor: severityColors[h.severity], fillOpacity: 0.25, weight: 2 }}>
                  <Popup>
                    <div style={{ fontFamily: 'sans-serif' }}><strong>{h.label}</strong><br />Severity: {h.severity}</div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Loss by Cause (trees)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={lossByCause} cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {lossByCause.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#c9d1d9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {lossByCause.map(c => (
              <div key={c.name} style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                {c.name}: {c.value.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Most Affected Species (YTD Loss)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 12 }}>
          {topSpecies.map(s => (
            <div key={s.id} style={{
              background: 'var(--gray-700)', borderRadius: 10, padding: '14px 16px',
              borderLeft: `3px solid ${
                s.status === 'Endangered' ? '#e87474' : s.status === 'Vulnerable' ? '#e8b84a' : '#6bcf6b'
              }`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--gray-100)', fontSize: 14 }}>{s.common}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', marginLeft: 6, fontStyle: 'italic' }}>{s.name}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: s.status === 'Endangered' ? 'var(--red-900)' : s.status === 'Vulnerable' ? '#3a2a1a' : 'var(--green-900)',
                  color: s.status === 'Endangered' ? 'var(--red-300)' : s.status === 'Vulnerable' ? '#e8b84a' : 'var(--green-300)',
                }}>{s.status}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--red-300)', marginBottom: 6 }}>{s.totalLoss.toLocaleString()} trees</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--gray-400)' }}>
                <span>🔥 {s.lossBreakdown.legal} legal</span>
                <span>⛓️ {s.lossBreakdown.illegal} illegal</span>
                <span>🦠 {s.lossBreakdown.disease} disease</span>
                <span>🔥 {s.lossBreakdown.fire} fire</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Regional Deforestation (ha) vs Reforestation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { region: 'Mau', loss: 480, reforest: 85 },
            { region: 'Mt. Kenya', loss: 320, reforest: 62 },
            { region: 'Elgon', loss: 210, reforest: 48 },
            { region: 'Kakamega', loss: 195, reforest: 120 },
            { region: 'Nyambene', loss: 140, reforest: 22 },
            { region: 'Aberdare', loss: 120, reforest: 55 },
            { region: 'Karura', loss: 85, reforest: 68 },
            { region: 'Arabuko', loss: 67, reforest: 18 },
            { region: 'Tsavo', loss: 52, reforest: 140 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="region" stroke="#8b949e" fontSize={11} />
            <YAxis stroke="#8b949e" fontSize={11} />
            <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#c9d1d9' }} />
            <Bar dataKey="loss" fill="#d14a4a" name="Deforested (ha)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reforest" fill="#3cb043" name="Reforested (ha)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
