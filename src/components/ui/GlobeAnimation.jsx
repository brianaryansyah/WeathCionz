import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

export default function GlobeAnimation({ className = "" }) {
  const globeEl = useRef()
  const containerRef = useRef(null)
  const [width, setWidth] = useState(500)

  useEffect(() => {
    // Enable auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.8
      globeEl.current.controls().enableZoom = false
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        setWidth(entries[0].contentRect.width)
      }
    })
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full aspect-square flex items-center justify-center ${className}`}>
      <Globe
        ref={globeEl}
        width={width}
        height={width}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#88bda4"
        atmosphereAltitude={0.15}
      />
    </div>
  )
}
