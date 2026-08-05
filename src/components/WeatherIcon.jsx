/**
 * Inline SVG weather icons keyed by OWM icon code group.
 * Lightweight, dependency-free and crisply rendered at any size.
 * Each condition carries its own vivid color when none is supplied.
 */
const CONDITION_COLORS = {
  '01': '#fbbf24',
  '02': '#f59e0b',
  '03': '#94a3b8',
  '04': '#64748b',
  '09': '#38bdf8',
  '10': '#0ea5e9',
  '11': '#8b5cf6',
  '13': '#7dd3fc',
  '50': '#94a3b8',
}

export default function WeatherIcon({ code, className = 'h-16 w-16' }) {
  if (!code) return null
  const group = String(code).replace(/\d$/, '')
  const isDay = String(code).endsWith('d')
  const color = CONDITION_COLORS[group] || '#0ea5e9'
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <svg viewBox="0 0 64 64" className={className} {...common} aria-hidden="true">
      {group === '01' && (isDay ? <Sun /> : <Moon />)}
      {group === '02' && <SunCloud isDay={isDay} />}
      {group === '03' && <Cloud />}
      {group === '04' && <Cloud />}
      {group === '09' && <CloudRain />}
      {group === '10' && <CloudRain isDay={isDay} />}
      {group === '11' && <Thunder />}
      {group === '13' && <Snow />}
      {group === '50' && <Mist />}
    </svg>
  )
}

function Sun() {
  return (
    <>
      <circle cx="32" cy="32" r="11" />
      <g strokeWidth="2.2">
        <path d="M32 8v6" />
        <path d="M32 50v6" />
        <path d="M8 32h6" />
        <path d="M50 32h6" />
        <path d="M15 15l4.2 4.2" />
        <path d="M44.8 44.8L49 49" />
        <path d="M49 15l-4.2 4.2" />
        <path d="M19.2 44.8L15 49" />
      </g>
    </>
  )
}

function Moon() {
  return <path d="M40 12a20 20 0 1 0 12 36 16 16 0 0 1-12-36z" />
}

function SunCloud({ isDay }) {
  return (
    <>
      {isDay && <circle cx="34" cy="24" r="7" />}
      <path d="M20 46a8 8 0 0 1-1-15.9A11 11 0 0 1 40 22.6 8.5 8.5 0 0 1 40 46z" />
    </>
  )
}

function Cloud() {
  return <path d="M22 48a9 9 0 0 1-1.6-17.9 12 12 0 0 1 23-1A7.5 7.5 0 0 1 43 48z" />
}

function CloudRain({ isDay }) {
  return (
    <>
      {isDay && <circle cx="30" cy="22" r="7" />}
      <path d="M20 40a8 8 0 0 1-.9-16A10.5 10.5 0 0 1 40 21.5 7.5 7.5 0 0 1 40 40z" />
      <path d="M22 44l-3 6" strokeWidth="1.6" />
      <path d="M31 44l-3 6" strokeWidth="1.6" />
      <path d="M40 44l-3 6" strokeWidth="1.6" />
    </>
  )
}

function Thunder() {
  return (
    <>
      <path d="M22 40a8 8 0 0 1-.9-16A10.5 10.5 0 0 1 42 21.5 7.5 7.5 0 0 1 42 40z" />
      <path d="M31 38l-5 10h7l-3 9 9-12h-7l4-7z" fill="currentColor" stroke="none" />
    </>
  )
}

function Snow() {
  return (
    <>
      <path d="M22 44a8 8 0 0 1-.9-16A10.5 10.5 0 0 1 42 25.5 7.5 7.5 0 0 1 42 44z" />
      <path d="M22 48l-1.5-1.5" strokeWidth="1.6" />
      <path d="M31 48l-1.5-1.5" strokeWidth="1.6" />
      <path d="M40 48l-1.5-1.5" strokeWidth="1.6" />
    </>
  )
}

function Mist() {
  return (
    <>
      <path d="M14 24h28" />
      <path d="M14 31h32" />
      <path d="M14 38h26" />
      <path d="M18 45h24" />
    </>
  )
}
