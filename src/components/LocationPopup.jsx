import { motion } from 'framer-motion'

export default function LocationPopup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
    >
      <div className="glass flex flex-col items-center gap-4 rounded-3xl px-8 py-6 shadow-2xl">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/30" />
          <svg className="relative h-6 w-6 animate-pulse text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="text-center animate-pulse">
          <h3 className="font-display text-lg font-semibold text-ink-950">
            Mendeteksi Lokasi...
          </h3>
          <p className="mt-1 text-sm text-ink-600">
            Menyesuaikan cuaca di tempat Anda
          </p>
        </div>
      </div>
    </motion.div>
  )
}
