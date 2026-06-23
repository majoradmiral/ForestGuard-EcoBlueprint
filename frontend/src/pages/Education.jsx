import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { BookOpen, Map, Globe, TreePine, ChevronDown, ChevronUp } from 'lucide-react'
import regions from '../data/regions'
import species from '../data/kenyaSpecies'
import { habitats } from '../data/kenyaSpecies'

const regionPolygons = {
  mau: [[-0.2,35.0],[-0.2,35.6],[-0.8,35.6],[-0.8,35.0]],
  mt_kenya: [[0.1,37.0],[0.1,38.0],[-0.5,38.0],[-0.5,37.0]],
  kakamega: [[0.3,34.5],[0.3,35.1],[0.7,35.1],[0.7,34.5]],
  karura: [[-1.05,36.7],[-1.05,36.9],[-1.35,36.9],[-1.35,36.7]],
  tsavo: [[-2.0,37.5],[-2.0,38.5],[-3.0,38.5],[-3.0,37.5]],
  arabuko: [[-3.2,39.2],[-3.2,39.8],[-3.6,39.8],[-3.6,39.2]],
  elgon: [[0.9,34.3],[0.9,34.9],[1.3,34.9],[1.3,34.3]],
  aberdare: [[-0.1,36.4],[-0.1,37.0],[-0.7,37.0],[-0.7,36.4]],
  nyambene: [[0.0,37.7],[0.0,38.3],[0.4,38.3],[0.4,37.7]],
  shimba: [[-4.0,39.1],[-4.0,39.7],[-4.4,39.7],[-4.4,39.1]],
  masai_mara: [[-1.1,34.6],[-1.1,35.4],[-1.7,35.4],[-1.7,34.6]],
}

export default function Education() {
  const [coloringMode, setColoringMode] = useState('region')
  const [expandedSpecies, setExpandedSpecies] = useState(null)

  const totalLossByCause = useMemo(() => {
    const totals = { legal: 0, illegal: 0, disease: 0, fire: 0 }
    species.forEach(s => {
      totals.legal += s.lossBreakdown.legal
      totals.illegal += s.lossBreakdown.illegal
      totals.disease += s.lossBreakdown.disease
      totals.fire += s.lossBreakdown.fire
    })
    return totals
  }, [])

  const endangeredSpecies = species.filter(s => s.status === 'Endangered')
  const vulnerableSpecies = species.filter(s => s.status === 'Vulnerable')

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>EcoBlueprint Education — Know Our Forests</h1>
        <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
          Two distinct coloring measures to learn about Kenya's forest regions and their unique habitats
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={`mode-btn ${coloringMode === 'region' ? 'active' : ''}`}
          onClick={() => setColoringMode('region')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Map size={16} /> Region Coloring
        </button>
        <button
          className={`mode-btn ${coloringMode === 'habitat' ? 'active' : ''}`}
          onClick={() => setColoringMode('habitat')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={16} /> Habitat Coloring
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ height: 500 }}>
            <MapContainer center={[0, 37]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {regions.map(r => {
                const poly = regionPolygons[r.id]
                if (!poly) return null
                const fillColor = coloringMode === 'region' ? r.color : (habitats.find(h => h.id === r.habitat)?.color || '#3cb043')
                return (
                  <Polygon key={r.id} positions={poly} pathOptions={{
                    color: fillColor,
                    fillColor,
                    fillOpacity: 0.3,
                    weight: 2,
                  }}>
                    <LeafletTooltip permanent direction="center" style={{
                      fontWeight: 700, fontSize: 11,
                      background: fillColor, color: '#fff',
                      border: 'none', padding: '4px 10px', borderRadius: 6,
                    }}>
                      {coloringMode === 'region' ? r.name : habitats.find(h => h.id === r.habitat)?.name}
                    </LeafletTooltip>
                  </Polygon>
                )
              })}
            </MapContainer>
          </div>
        </div>

        <div>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12,
            padding: 16, marginBottom: 12,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 12 }}>
              {coloringMode === 'region' ? 'Region Color Legend' : 'Habitat Color Legend'}
            </h3>
            {coloringMode === 'region' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {regions.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: r.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--gray-300)' }}>{r.name}</span>
                    <span style={{ color: 'var(--gray-400)', marginLeft: 'auto' }}>{r.deforestedHa}ha</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {habitats.map(h => (
                  <div key={h.id} style={{
                    background: 'var(--gray-700)', borderRadius: 8, padding: '10px 12px',
                    borderLeft: `3px solid ${h.color}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 16 }}>{h.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-100)' }}>{h.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{h.desc}</div>
                    <div style={{ fontSize: 11, color: h.color, marginTop: 4 }}>
                      {regions.filter(r => r.habitat === h.id).length} regions
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-100)', marginBottom: 8 }}>Kenya's Forests at a Glance</h3>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.7 }}>
              <div>🌲 <strong style={{ color: 'var(--gray-200)' }}>{regions.length}</strong> forest regions monitored</div>
              <div>🌳 <strong style={{ color: 'var(--gray-200)' }}>{species.length}</strong> native tree species tracked</div>
              <div>🆘 <strong style={{ color: 'var(--red-300)' }}>{endangeredSpecies.length}</strong> endangered species</div>
              <div>⚠️ <strong style={{ color: 'var(--amber-300)' }}>{vulnerableSpecies.length}</strong> vulnerable species</div>
              <div>🔥 <strong style={{ color: 'var(--red-300)' }}>{(totalLossByCause.illegal + totalLossByCause.legal).toLocaleString()}</strong> trees lost to logging</div>
              <div>🦠 <strong style={{ color: '#e8b84a' }}>{totalLossByCause.disease.toLocaleString()}</strong> trees lost to disease</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-100)', marginBottom: 4 }}>
          <BookOpen size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Species Education — Know What We're Losing
        </h2>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 }}>
          Click on each species to learn more about its ecological role and threats
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {species.map(s => (
            <div key={s.id} style={{
              background: 'var(--gray-700)', borderRadius: 10,
              border: expandedSpecies === s.id ? `1px solid ${
                s.status === 'Endangered' ? 'var(--red-400)' : s.status === 'Vulnerable' ? '#e8b84a' : 'var(--green-400)'
              }` : '1px solid transparent',
              overflow: 'hidden',
            }}>
              <div onClick={() => setExpandedSpecies(expandedSpecies === s.id ? null : s.id)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${s.leafColor}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {s.canopyShape === 'conical' ? '▲' : s.canopyShape === 'umbrella' ? '☂' : '●'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-100)' }}>{s.common}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', fontStyle: 'italic' }}>{s.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: s.status === 'Endangered' ? 'var(--red-900)' : s.status === 'Vulnerable' ? '#3a2a1a' : 'var(--green-900)',
                    color: s.status === 'Endangered' ? 'var(--red-300)' : s.status === 'Vulnerable' ? '#e8b84a' : 'var(--green-300)',
                  }}>{s.status}</span>
                  {expandedSpecies === s.id ? <ChevronUp size={16} color="var(--gray-400)" /> : <ChevronDown size={16} color="var(--gray-400)" />}
                </div>
              </div>

              {expandedSpecies === s.id && (
                <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)', marginTop: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                    <div style={{ background: 'var(--gray-800)', borderRadius: 6, padding: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>KEFRI Code</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-100)' }}>{s.kefri_code}</div>
                    </div>
                    <div style={{ background: 'var(--gray-800)', borderRadius: 6, padding: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>Habitat</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-100)' }}>
                        {habitats.find(h => h.id === s.habitat)?.name || s.habitat}
                      </div>
                    </div>
                    <div style={{ background: 'var(--gray-800)', borderRadius: 6, padding: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>Remaining Trees</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-100)' }}>{s.remaining.toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'var(--gray-800)', borderRadius: 6, padding: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>Carbon/Tree</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-100)' }}>{s.carbonPerTree} kg CO₂</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 6 }}>Loss Breakdown ({s.totalLoss.toLocaleString()} trees)</div>
                    <div style={{ display: 'flex', gap: 0, height: 20, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        flex: s.lossBreakdown.legal, background: '#6bcf6b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: '#0a1f0a',
                      }}>{s.lossBreakdown.legal > 100 ? 'L' : ''}</div>
                      <div style={{
                        flex: s.lossBreakdown.illegal, background: '#e87474',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: '#fff',
                      }}>{s.lossBreakdown.illegal > 200 ? 'I' : ''}</div>
                      <div style={{
                        flex: s.lossBreakdown.disease, background: '#e8b84a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: '#1a1a0a',
                      }}>{s.lossBreakdown.disease > 100 ? 'D' : ''}</div>
                      <div style={{
                        flex: s.lossBreakdown.fire, background: '#e88a4a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: '#fff',
                      }}>{s.lossBreakdown.fire > 50 ? 'F' : ''}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 10, color: 'var(--gray-400)' }}>
                      <span>L: {s.lossBreakdown.legal}</span>
                      <span>I: {s.lossBreakdown.illegal}</span>
                      <span>D: {s.lossBreakdown.disease}</span>
                      <span>F: {s.lossBreakdown.fire}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gray-400)' }}>
                    <strong style={{ color: 'var(--gray-200)' }}>Uses:</strong> {s.uses}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>
                    <strong style={{ color: 'var(--gray-200)' }}>Regions:</strong> {s.regions.map(rid => regions.find(r => r.id === rid)?.name).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, var(--green-900), var(--gray-800))',
        border: '1px solid var(--green-700)', borderRadius: 12, padding: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-200)', marginBottom: 12 }}>How You Can Help</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🌱</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-200)', marginBottom: 4 }}>Report Illegal Logging</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Use the hotspot view to report suspicious clearing activities to KFS</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🌿</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-200)', marginBottom: 4 }}>Plant Native Species</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Prioritize endangered natives like Meru Oak and Muhuhu in reforestation</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📡</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-200)', marginBottom: 4 }}>KEFRI Data Contribution</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Submit field observations via the KEFRI webhook API endpoint</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🔥</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-200)', marginBottom: 4 }}>Fire Prevention</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>530 trees lost to fire — report uncontrolled burns immediately</p>
          </div>
        </div>
      </div>
    </div>
  )
}
