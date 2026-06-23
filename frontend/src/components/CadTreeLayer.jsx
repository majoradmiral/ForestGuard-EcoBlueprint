import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

const TREE_SVG = {
  rounded: (color, size = 18) => `
    <svg width="${size}" height="${size * 1.4}" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="4" height="8" fill="#5c4033" rx="1"/>
      <circle cx="10" cy="10" r="10" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.9"/>
      <circle cx="7" cy="8" r="3" fill="${color}" fill-opacity="0.3"/>
      <circle cx="13" cy="9" r="2.5" fill="${color}" fill-opacity="0.25"/>
    </svg>
  `,
  conical: (color, size = 20) => `
    <svg width="${size}" height="${size * 1.3}" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="4" height="8" fill="#5c4033" rx="1"/>
      <polygon points="10,0 1,18 19,18" fill="${color}" stroke="${color}" stroke-width="0.5" opacity="0.9"/>
      <polygon points="10,4 4,16 16,16" fill="${color}" fill-opacity="0.3"/>
    </svg>
  `,
  umbrella: (color, size = 22) => `
    <svg width="${size}" height="${size * 1.2}" viewBox="0 0 22 26" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="16" width="4" height="10" fill="#5c4033" rx="1"/>
      <path d="M1,14 Q11,2 21,14" fill="${color}" stroke="${color}" stroke-width="0.5" opacity="0.9"/>
      <path d="M4,10 Q11,6 18,10" fill="${color}" fill-opacity="0.2"/>
    </svg>
  `,
}

const causeColors = {
  legal: '#6bcf6b',
  illegal: '#e87474',
  disease: '#e8b84a',
  fire: '#e88a4a',
}

export default function CadTreeLayer({ trees, mode = 'region' }) {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!map || !trees?.length) return

    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    const markers = []
    const L = window.L

    trees.forEach((t, i) => {
      const size = t.size || 18
      const color = mode === 'region'
        ? (t.regionColor || '#3cb043')
        : mode === 'habitat'
          ? (t.habitatColor || '#3cb043')
          : (causeColors[t.cause] || '#e87474')

      const shape = t.canopyShape || 'rounded'
      const svgString = TREE_SVG[shape](color, size)
      const encoded = encodeURIComponent(svgString)
      const dataUri = `data:image/svg+xml;charset=UTF-8,${encoded}`

      const icon = L.divIcon({
        html: `<img src="${dataUri}" alt="tree" style="pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />`,
        className: '',
        iconSize: [size, size * 1.4],
        iconAnchor: [size / 2, size * 1.2],
      })

      const marker = L.marker([t.lat, t.lng], { icon })
      if (t.label) {
        marker.bindPopup(`<div style="font-family:Segoe UI,sans-serif;min-width:160px">
          <strong style="font-size:14px">${t.label}</strong>
          ${t.species ? `<div style="font-size:12px;color:#666;margin:2px 0">${t.species}</div>` : ''}
          ${t.cause ? `<div style="font-size:11px;color:${causeColors[t.cause] || '#666'};margin-top:2px">● ${t.cause.toUpperCase()}</div>` : ''}
        </div>`)
      }
      markers.push(marker)
    })

    const group = L.featureGroup(markers)
    group.addTo(map)
    layerRef.current = group

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [map, trees, mode])

  return null
}
