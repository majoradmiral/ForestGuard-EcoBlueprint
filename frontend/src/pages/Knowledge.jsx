import { useState, useMemo } from 'react'
import { BookOpen, ExternalLink, FileText, Video, BookMarked, Search, Filter, Library, GraduationCap, Sprout } from 'lucide-react'
import flrResources, { resourceCategories, resourceTypes, speciesFlrMap } from '../data/kefriFlr'
import species from '../data/kenyaSpecies'

const typeIcons = {
  user_guide: FileText,
  technical_manual: BookMarked,
  how_to: GraduationCap,
  best_practice: Sprout,
  research_report: Library,
  case_study: BookOpen,
  policy: FileText,
  training: GraduationCap,
}

const typeColors = {
  user_guide: 'var(--blue-300)',
  technical_manual: 'var(--teal-300)',
  how_to: 'var(--green-300)',
  best_practice: 'var(--green-400)',
  research_report: 'var(--amber-300)',
  case_study: 'var(--blue-500)',
  policy: 'var(--red-300)',
  training: 'var(--teal-500)',
}

export default function Knowledge() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    let r = flrResources
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(res =>
        res.title.toLowerCase().includes(q) ||
        res.summary.toLowerCase().includes(q) ||
        res.tags.some(t => t.includes(q)) ||
        res.author.toLowerCase().includes(q)
      )
    }
    if (filterCategory) r = r.filter(res => res.category === filterCategory)
    if (filterType) r = r.filter(res => res.type === filterType)
    return r
  }, [search, filterCategory, filterType])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-100)' }}>
          <Library size={24} style={{ marginRight: 10, verticalAlign: 'middle' }} />
          KEFRI FLR Knowledge Base
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>
          Curated resources from the KEFRI Forest Landscape Restoration platform — publications, how-tos, best practices, and case studies
        </p>
      </div>

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--gray-400)' }} />
            <input
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--gray-700)', color: 'var(--gray-100)', fontSize: 14, outline: 'none',
              }}
            />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--gray-700)', color: 'var(--gray-100)', fontSize: 13, outline: 'none',
            }}>
            <option value="">All Categories</option>
            {resourceCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--gray-700)', color: 'var(--gray-100)', fontSize: 13, outline: 'none',
            }}>
            <option value="">All Types</option>
            {resourceTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div style={{ fontSize: 13, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
            <Filter size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {filtered.length} of {flrResources.length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => {
          const Icon = typeIcons[r.type] || FileText
          const color = typeColors[r.type] || 'var(--gray-400)'
          const cat = resourceCategories.find(c => c.id === r.category)
          const isOpen = expanded === r.uuid
          const linkedSpecies = r.species.map(sp => species.find(s => s.id === sp)).filter(Boolean)

          return (
            <div key={r.uuid} style={{
              background: 'var(--card-bg)', border: `1px solid ${isOpen ? color : 'var(--border)'}`,
              borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <div onClick={() => setExpanded(isOpen ? null : r.uuid)}
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-100)', marginBottom: 2 }}>{r.title}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 12, color: 'var(--gray-400)' }}>
                    <span>{cat?.name || r.category}</span>
                    <span>•</span>
                    <span style={{ color }}>{resourceTypes.find(t => t.id === r.type)?.name || r.type}</span>
                    <span>•</span>
                    <span>{r.date_added}</span>
                    {r.language !== 'English' && <><span>•</span><span>{r.language}</span></>}
                  </div>
                </div>
                <a href={r.kefri_url} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ color: 'var(--green-400)', padding: 6, borderRadius: 6, flexShrink: 0 }}
                  title="Open on KEFRI FLR">
                  <ExternalLink size={18} />
                </a>
              </div>

              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, color: 'var(--gray-300)', lineHeight: 1.6, marginTop: 12 }}>{r.summary}</p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {r.tags.map(t => (
                      <span key={t} style={{
                        background: 'var(--gray-700)', color: 'var(--gray-300)',
                        padding: '2px 10px', borderRadius: 12, fontSize: 11,
                      }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gray-400)' }}>
                    <strong style={{ color: 'var(--gray-200)' }}>Author(s):</strong> {r.author}
                  </div>

                  {linkedSpecies.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                        <strong style={{ color: 'var(--gray-200)' }}>Related Species:</strong>{' '}
                        {linkedSpecies.map(s => (
                          <span key={s.id} style={{
                            display: 'inline-block', padding: '1px 8px', borderRadius: 10,
                            background: 'var(--gray-700)', color: s.status === 'Endangered' ? 'var(--red-300)' : 'var(--green-300)',
                            fontSize: 11, marginRight: 4, marginBottom: 2,
                          }}>{s.common} ({s.kefri_code})</span>
                        ))}
                      </span>
                    </div>
                  )}

                  {r.regions.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>
                      <strong style={{ color: 'var(--gray-200)' }}>Regions:</strong> {r.regions.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No resources match your filters.</p>
        </div>
      )}

      <div style={{
        marginTop: 32, background: 'linear-gradient(135deg, var(--green-900), var(--gray-800))',
        border: '1px solid var(--green-700)', borderRadius: 12, padding: 20,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-200)', marginBottom: 8 }}>
          <ExternalLink size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          KEFRI FLR Portal
        </h2>
        <p style={{ fontSize: 13, color: 'var(--gray-300)', lineHeight: 1.6 }}>
          These resources are sourced from{' '}
          <a href="https://flr.kefri.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-300)' }}>
            flr.kefri.org
          </a>
          , the official Forest Landscape Restoration knowledge platform by the Kenya Forestry Research Institute.
          ForestGuard EcoBlueprint complements this knowledge base with real-time monitoring and blueprint planning.
        </p>
      </div>
    </div>
  )
}
