import { motion } from 'motion/react'
import { MapPin } from 'lucide-react'

/**
 * Fullscreen overlay shown while the app resolves the user's position.
 * When only an approximate (IP) fix is possible, it explains why and
 * offers a retry so the browser can prompt for GPS permission again.
 */
export default function LocationPopup({ source = 'gps', onRetry }) {
  const isIp = source === 'ip'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
      role="alertdialog"
      aria-labelledby="location-popup-title"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass relative flex flex-col items-center gap-6 rounded-[2rem] px-10 py-12 text-center shadow-2xl border border-white/40 bg-white/70 overflow-hidden max-w-sm w-full mx-4"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        <div className="relative flex h-24 w-24 items-center justify-center z-10">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 animate-ping rounded-full bg-orange-500/40" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 shadow-[0_8px_16px_rgba(249,115,22,0.3)] border-2 border-white">
            <MapPin className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="animate-pulse">
          <h3 className="font-display text-lg font-semibold text-ink-950">
            {isIp ? 'Menentukan Lokasi Perkiraan' : 'Mendeteksi Lokasi Anda'}
          </h3>
          <p className="mt-1 max-w-xs text-sm text-ink-600">
            {isIp
              ? 'GPS belum aktif, jadi kami memakai perkiraan dari jaringan Anda. Klik "Coba lagi" dan izinkan akses lokasi untuk hasil yang presisi.'
              : 'Akurasi tinggi untuk cuaca di tempat Anda sekarang'}
          </p>
        </div>
        {isIp && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary rounded-full px-5 py-2 text-sm"
          >
            Coba lagi
          </button>
        )}
      </div>
    </motion.div>
  )
}
