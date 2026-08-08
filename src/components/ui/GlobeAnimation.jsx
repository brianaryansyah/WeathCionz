import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

export default function GlobeAnimation({ className = "" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let phi = 0
    let width = 500 // Initial fallback
    
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        width = entries[0].contentRect.width
      }
    })
    
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0, // Light theme
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.95, 0.95, 0.95], // Off-white/light gray globe
      markerColor: [0.05, 0.65, 0.95], // Crisp blue markers
      glowColor: [0.9, 0.95, 1], // Soft light-blue glow matching white bg
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 }, // San Francisco
        { location: [40.7128, -74.0060], size: 0.05 }, // New York
        { location: [51.5074, -0.1278], size: 0.04 }, // London
        { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        { location: [-6.2088, 106.8456], size: 0.08 }, // Jakarta
        { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
        { location: [55.7558, 37.6173], size: 0.04 }, // Moscow
      ],
      onRender: (state) => {
        state.phi = phi
        phi += 0.003
        state.width = width * 2
        state.height = width * 2
      },
    })

    return () => {
      globe.destroy()
      observer.disconnect()
    }
  }, [])

  return (
    <div className={`relative w-full aspect-square flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_40px_rgba(14,165,233,0.2)]"
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size'
        }}
      />
    </div>
  )
}
