import { Link, useLocation } from 'react-router-dom'
import { Trees, Map, BookOpen, Flame, BarChart3 } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: Trees },
  { to: '/map', label: 'Ecology Map', icon: Map },
  { to: '/education', label: 'Education', icon: BookOpen },
  { to: '/hotspots', label: 'Hotspots', icon: Flame },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function Header() {
  const location = useLocation()

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0a1f0a, #0d1117, #0d1a10)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green-300)', fontWeight: 700, fontSize: 20 }}>
          <Trees size={28} />
          <span>ForestGuard EcoBlueprint</span>
        </Link>

        <nav style={{ display: 'flex', gap: 4 }}>
          {links.map(l => {
            const active = location.pathname === l.to
            return (
              <Link key={l.to} to={l.to} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                fontSize: 14, fontWeight: 500,
                color: active ? 'var(--green-300)' : 'var(--gray-400)',
                background: active ? 'var(--green-900)' : 'transparent',
                border: active ? '1px solid var(--green-700)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <l.icon size={18} />
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
