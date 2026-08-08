import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

export default function GlobeAnimation({ className = "" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener('resize', onResize)
    onResize()

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // 1 for dark theme
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.05], // Very dark grey, almost black
      markerColor: [0.1, 0.8, 1], // Bright sky blue
      glowColor: [0, 0.3, 0.7], // Indigo glow
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
      window.removeEventListener('resize', onResize)
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
          contain: 'layout paint size',
          opacity: 0,
          animation: 'fade-in-globe 1.5s ease-out 0.2s forwards'
        }}
      />
      <style>{`
        @keyframes fade-in-globe {
          0% { opacity: 0; transform: scale(0.9) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
