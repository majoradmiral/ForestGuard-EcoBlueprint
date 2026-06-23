import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Download, FileText, Filter } from 'lucide-react'
import { useState } from 'react'
import species from '../data/kenyaSpecies'
import regions from '../data/regions'

const COLORS = ['#3cb043', '#6bcf6b', '#a3e4a3', '#228b22', '#166616', '#0d2b0d']

const lossByCauseData = [
  { cause: 'Illegal Logging', trees: 2840, pct: 52, color: '#e87474' },
  { cause: 'Legal Logging', trees: 1225, pct: 22, color: '#6bcf6b' },
  { cause: 'Disease', trees: 865, pct: 16, color: '#e8b84a' },
  { cause: 'Fire', trees: 530, pct: 10, color: '#e88a4a' },
]

const regionData = regions
  .map(r => ({
    region: r.name.split(' ')[0],
    area: r.deforestedHa,
    trees: r.lossBreakdown.legal + r.lossBreakdown.illegal + r.lossBreakdown.disease + r.lossBreakdown.fire,
  }))
  .sort((a, b) => b.trees - a.trees)

const carbonData = [
  { year: '2020', seq: 1200 }, { year: '2021', seq: 1500 }, { year: '2022', seq: 1800 },
  { year: '2023', seq: 2100 }, { year: '2024', seq: 2800 }, { year: '2025', seq: 3500 },
  { year: '2026', seq: 4200 },
]

export default function Reports() {
  const [speciesFilter, setSpeciesFilter] = useState('all')

  const filteredSpecies = speciesFilter === 'all'
    ? species
    : species.filter(s => s.habitat === speciesFilter)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>EcoBlueprint Reports & Analytics</h1>
          <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
            Species-level deforestation analysis · KEFRI-integrated loss data · Carbon projections
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          background: 'var(--green-700)', border: '1px solid var(--green-500)', borderRadius: 8,
          color: 'var(--green-200)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Tree Loss by Cause (Total: 5,460)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={lossByCauseData} cx="50%" cy="50%" outerRadius={90} innerRadius={45}
                dataKey="trees" label={({ cause, percent }) => `${cause} ${(percent * 100).toFixed(0)}%`}>
                {lossByCauseData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#c9d1d9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {lossByCauseData.map(d => (
              <div key={d.cause} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-300)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                {d.cause}: {d.trees.toLocaleString()} ({d.pct}%)
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Deforestation by Region</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis type="number" stroke="#8b949e" fontSize={11} />
              <YAxis dataKey="region" type="category" stroke="#8b949e" fontSize={11} width={90} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#c9d1d9' }} />
              <Bar dataKey="area" fill="#d14a4a" name="Area (ha)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="trees" fill="#e87474" name="Trees lost" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Carbon Sequestration Projection</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="year" stroke="#8b949e" fontSize={11} />
              <YAxis stroke="#8b949e" fontSize={11} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#c9d1d9' }} />
              <Area type="monotone" dataKey="seq" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.2} name="CO₂ (tons)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 16 }}>Species Status Overview</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {['all', ...new Set(species.map(s => s.habitat))].map(h => (
              <button key={h} onClick={() => setSpeciesFilter(h)}
                style={{
                  padding: '4px 12px', borderRadius: 14, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  background: speciesFilter === h ? 'var(--green-700)' : 'var(--card-bg)',
                  color: 'var(--text)', border: speciesFilter === h ? '1px solid var(--green-400)' : '1px solid var(--border)',
                }}>
                {h === 'all' ? 'All' : h.charAt(0).toUpperCase() + h.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {filteredSpecies.map(s => (
              <div key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-100)' }}>{s.common}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', fontStyle: 'italic' }}>{s.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-200)' }}>{s.remaining.toLocaleString()}</div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 8,
                    background: s.status === 'Endangered' ? 'var(--red-900)' : s.status === 'Vulnerable' ? '#3a2a1a' : 'var(--green-900)',
                    color: s.status === 'Endangered' ? 'var(--red-300)' : s.status === 'Vulnerable' ? '#e8b84a' : 'var(--green-300)',
                  }}>{s.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-100)' }}>Species Loss Data Table</h2>
          <FileText size={18} color="var(--gray-400)" />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--gray-700)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--gray-300)', fontWeight: 600 }}>Species</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-300)', fontWeight: 600 }}>Legal</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-300)', fontWeight: 600 }}>Illegal</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-300)', fontWeight: 600 }}>Disease</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-300)', fontWeight: 600 }}>Fire</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-300)', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--gray-300)', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {species.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--gray-100)', fontWeight: 500 }}>
                    {s.common}
                    <span style={{ color: 'var(--gray-400)', marginLeft: 4, fontStyle: 'italic' }}>{s.name}</span>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#6bcf6b' }}>{s.lossBreakdown.legal}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e87474' }}>{s.lossBreakdown.illegal}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e8b84a' }}>{s.lossBreakdown.disease}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e88a4a' }}>{s.lossBreakdown.fire}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-200)', fontWeight: 600 }}>{s.totalLoss}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                      background: s.status === 'Endangered' ? 'var(--red-900)' : s.status === 'Vulnerable' ? '#3a2a1a' : 'var(--green-900)',
                      color: s.status === 'Endangered' ? 'var(--red-300)' : s.status === 'Vulnerable' ? '#e8b84a' : 'var(--green-300)',
                    }}>{s.status}</span>
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--gray-700)', fontWeight: 700 }}>
                <td style={{ padding: '10px 16px', color: 'var(--gray-100)' }}>TOTAL</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: '#6bcf6b' }}>
                  {species.reduce((sum, s) => sum + s.lossBreakdown.legal, 0).toLocaleString()}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e87474' }}>
                  {species.reduce((sum, s) => sum + s.lossBreakdown.illegal, 0).toLocaleString()}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e8b84a' }}>
                  {species.reduce((sum, s) => sum + s.lossBreakdown.disease, 0).toLocaleString()}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e88a4a' }}>
                  {species.reduce((sum, s) => sum + s.lossBreakdown.fire, 0).toLocaleString()}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gray-100)' }}>
                  {species.reduce((sum, s) => sum + s.totalLoss, 0).toLocaleString()}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
