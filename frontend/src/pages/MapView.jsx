import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useMemo } from 'react'
import { Layers, MapPin, Eye } from 'lucide-react'
import MapLegend from '../components/MapLegend'
import regions from '../data/regions'
import species from '../data/kenyaSpecies'
import { habitats } from '../data/kenyaSpecies'

const causeColors = { legal: '#6bcf6b', illegal: '#e87474', disease: '#e8b84a', fire: '#e88a4a' }
const severityColors = { critical: '#ff2222', high: '#d14a4a', medium: '#e87474', low: '#6bcf6b', stable: '#3cb043' }

const hotspotData = [
  { id:1,region:"Mau Forest",lat:-0.48,lng:35.28,cause:"illegal",severity:"high",trees:340 },
  { id:2,region:"Mau Forest",lat:-0.55,lng:35.32,cause:"disease",severity:"high",trees:180 },
  { id:3,region:"Mt. Kenya",lat:-0.18,lng:37.48,cause:"illegal",severity:"critical",trees:520 },
  { id:4,region:"Mt. Kenya",lat:-0.22,lng:37.52,cause:"fire",severity:"medium",trees:90 },
  { id:5,region:"Kakamega",lat:0.48,lng:34.78,cause:"legal",severity:"low",trees:60 },
  { id:6,region:"Kakamega",lat:0.52,lng:34.82,cause:"illegal",severity:"medium",trees:120 },
  { id:7,region:"Karura",lat:-1.18,lng:36.82,cause:"illegal",severity:"medium",trees:85 },
  { id:8,region:"Mt. Elgon",lat:1.08,lng:34.58,cause:"legal",severity:"medium",trees:200 },
  { id:9,region:"Arabuko-Sokoke",lat:-3.42,lng:39.48,cause:"illegal",severity:"high",trees:280 },
  { id:10,region:"Nyambene",lat:0.18,lng:38.02,cause:"illegal",severity:"critical",trees:410 },
  { id:11,region:"Mau Forest",lat:-0.52,lng:35.26,cause:"legal",severity:"low",trees:45 },
  { id:12,region:"Aberdare",lat:-0.38,lng:36.72,cause:"disease",severity:"medium",trees:150 },
  { id:13,region:"Tsavo",lat:-2.48,lng:38.02,cause:"fire",severity:"high",trees:230 },
  { id:14,region:"Shimba",lat:-4.18,lng:39.42,cause:"disease",severity:"medium",trees:95 },
  { id:15,region:"Mt. Elgon",lat:1.12,lng:34.62,cause:"fire",severity:"high",trees:175 },
  { id:16,region:"Masai Mara",lat:-1.42,lng:35.02,cause:"fire",severity:"medium",trees:80 },
  { id:17,region:"Mt. Kenya",lat:-0.16,lng:37.55,cause:"legal",severity:"low",trees:120 },
  { id:18,region:"Mau Forest",lat:-0.45,lng:35.35,cause:"illegal",severity:"high",trees:290 },
]

export default function MapView() {
  const [mode, setMode] = useState('region')
  const [filter, setFilter] = useState('all')

  const markers = useMemo(() => {
    if (mode === 'hotspot') {
      return hotspotData.filter(h => filter === 'all' || h.cause === filter).map(h => ({
        lat: h.lat, lng: h.lng,
        radius: h.severity === 'critical' ? 16 : h.severity === 'high' ? 12 : h.severity === 'medium' ? 8 : 5,
        color: causeColors[h.cause],
        fillColor: causeColors[h.cause],
        fillOpacity: 0.35,
        label: h.region,
        detail: `${h.trees} trees · ${h.cause}`,
        severity: h.severity,
        cause: h.cause,
      }))
    }
    return regions.map(r => ({
      lat: r.lat, lng: r.lng,
      radius: Math.max(6, r.deforestedHa / 40),
      color: mode === 'region' ? r.color : (habitats.find(h => h.id === r.habitat)?.color || '#3cb043'),
      fillColor: mode === 'region' ? r.color : (habitats.find(h => h.id === r.habitat)?.color || '#3cb043'),
      fillOpacity: 0.3,
      label: r.name,
      detail: `${r.deforestedHa} ha deforested · ${r.species.length} species tracked`,
      severity: r.status,
      habitat: r.habitat,
    }))
  }, [mode, filter])

  const legendItems = useMemo(() => {
    if (mode === 'hotspot') {
      return [
        { label: 'Legal Logging', color: '#6bcf6b' },
        { label: 'Illegal Logging', color: '#e87474' },
        { label: 'Disease', color: '#e8b84a' },
        { label: 'Fire', color: '#e88a4a' },
      ]
    }
    if (mode === 'region') {
      return regions.map(r => ({ label: r.name, color: r.color }))
    }
    return habitats.map(h => ({ label: h.name, color: h.color }))
  }, [mode])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>EcoBlueprint Map</h1>
        <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
          KEFRI-tracked forest regions · Colored by {mode === 'region' ? 'region' : mode === 'habitat' ? 'habitat type' : 'cutting cause'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className={`mode-btn ${mode === 'region' ? 'active' : ''}`} onClick={() => { setMode('region'); setFilter('all') }}>
          <Layers size={14} style={{ marginRight: 4 }} /> Region Colors
        </button>
        <button className={`mode-btn ${mode === 'habitat' ? 'active' : ''}`} onClick={() => { setMode('habitat'); setFilter('all') }}>
          <Eye size={14} style={{ marginRight: 4 }} /> Habitat Colors
        </button>
        <button className={`mode-btn ${mode === 'hotspot' ? 'active' : ''}`} onClick={() => { setMode('hotspot'); setFilter('all') }}>
          <MapPin size={14} style={{ marginRight: 4 }} /> Cutting Hotspots
        </button>

        {mode === 'hotspot' && (
          <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
            {['all','legal','illegal','disease','fire'].map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '4px 12px', borderRadius: 14, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                background: filter === c ? (c === 'all' ? 'var(--green-700)' : `${causeColors[c]}22`) : 'var(--card-bg)',
                color: filter === c ? (c === 'all' ? 'var(--green-200)' : causeColors[c]) : 'var(--text)',
                border: filter === c ? `1px solid ${c === 'all' ? 'var(--green-400)' : causeColors[c]}` : '1px solid var(--border)',
              }}>
                {c === 'all' ? 'All Causes' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ height: 520 }}>
            <MapContainer center={[0, 37]} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {markers.map((m, i) => (
                <CircleMarker key={i} center={[m.lat, m.lng]} radius={m.radius}
                  pathOptions={{ color: m.color, fillColor: m.fillColor, fillOpacity: m.fillOpacity, weight: 2 }}>
                  <Popup>
                    <div style={{ fontFamily: 'sans-serif', minWidth: 180 }}>
                      <strong style={{ fontSize: 14 }}>{m.label}</strong>
                      <div style={{ fontSize: 12, color: m.color, margin: '4px 0' }}>● {m.detail}</div>
                      {m.severity && <div style={{ fontSize: 11, color: severityColors[m.severity] || '#666' }}>
                        Status: {m.severity}
                      </div>}
                      {m.habitat && <div style={{ fontSize: 11, color: '#888' }}>
                        Habitat: {habitats.find(h => h.id === m.habitat)?.name || m.habitat}
                      </div>}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div>
          <MapLegend mode={mode} items={legendItems} />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-400)', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
            {mode === 'hotspot' ? (
              <>
                <div style={{ fontWeight: 600, color: 'var(--gray-200)', marginBottom: 6 }}>{filter === 'all' ? 'All events' : filter} · {markers.length} sites</div>
                <div>Marker size = severity (critical→large)</div>
                <div style={{ marginTop: 4 }}>Total trees: {markers.reduce((s, m) => s + (parseInt(m.detail) || 0), 0).toLocaleString()}</div>
              </>
            ) : mode === 'region' ? (
              <>
                <div style={{ fontWeight: 600, color: 'var(--gray-200)', marginBottom: 6 }}>{regions.length} forest regions</div>
                <div>Each colored uniquely by region ID</div>
                <div style={{ marginTop: 4 }}>Size = deforestation extent (ha)</div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: 'var(--gray-200)', marginBottom: 6 }}>{habitats.length} habitat types</div>
                <div>Montane · Lowland · Coastal · Savanna · Riparian</div>
                <div style={{ marginTop: 4 }}>Colors reflect ecological zone</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {markers.map((m, i) => (
          <div key={i} style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px',
            borderLeft: `3px solid ${m.color}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: m.color, marginBottom: 2 }}>{m.detail}</div>
            {m.severity && (
              <div style={{ fontSize: 11, color: severityColors[m.severity] || 'var(--gray-400)' }}>
                {m.severity}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
