import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

export default function GlobeAnimation({ className = "" }) {
  const globeEl = useRef()
  const containerRef = useRef(null)
  const [width, setWidth] = useState(500)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // 1. Get real-time user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          // Auto-focus camera on user's location gracefully
          if (globeEl.current) {
            globeEl.current.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: 2 }, 2000);
          }
        },
        (error) => {
          console.warn("Location access denied or failed. Fallback to Indonesia.", error);
          const fallback = { lat: -2.5489, lng: 118.0149 }; // Indonesia
          setUserLocation(fallback);
          if (globeEl.current) {
            globeEl.current.pointOfView({ lat: fallback.lat, lng: fallback.lng, altitude: 2 }, 2000);
          }
        }
      );
    }

    // 2. Setup Globe settings
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.5
      globeEl.current.controls().enableZoom = false
    }

    // 3. Handle responsiveness
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
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {/* 
        To simulate a temperature heatmap like the screenshot without using ugly dots, 
        we use the photorealistic blue marble and apply CSS filters to make it "warm".
        saturate(2.5) contrast(1.2) hue-rotate(-20deg) shifts green land to yellow/orange/red 
        while keeping oceans blue, perfectly mimicking a topological temperature map!
      */}
      <div className="w-full h-full mix-blend-multiply drop-shadow-[0_0_50px_rgba(249,115,22,0.2)]" style={{ filter: 'saturate(2.5) contrast(1.2) brightness(1.2) sepia(0.2) hue-rotate(-15deg)' }}>
        <Globe
          ref={globeEl}
          width={width}
          height={width}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#f97316"
          atmosphereAltitude={0.15}
          
          // --- User Location Pulsing Ring ---
          ringsData={userLocation ? [userLocation] : []}
          ringColor={() => '#2563eb'} // Bright blue pulse
          ringMaxRadius={8}
          ringPropagationSpeed={2}
          ringRepeatPeriod={800}
          
          // --- User Location HTML Marker ---
          htmlElementsData={userLocation ? [userLocation] : []}
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none; transform: translate(-50%, -50%);">
                <div style="width: 16px; height: 16px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(59,130,246,1);"></div>
                <div style="margin-top: 6px; padding: 2px 8px; background-color: rgba(255,255,255,0.9); border-radius: 4px; color: #1d4ed8; font-size: 11px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); white-space: nowrap;">
                  You are here
                </div>
              </div>
            `;
            return el;
          }}
          htmlAltitude={0.05} // Slightly above the surface
        />
      </div>
    </div>
  )
}
