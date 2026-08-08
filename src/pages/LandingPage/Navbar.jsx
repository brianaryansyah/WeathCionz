import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CloudSun } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-4 right-4 md:left-auto md:right-auto md:w-full max-w-3xl md:mx-auto z-50 flex items-center justify-between px-6 py-3 glass-dark rounded-full"
    >
      <div className="flex items-center gap-2">
        <CloudSun className="w-8 h-8 text-sky-500" />
        <span className="text-xl font-bold font-display text-white">WeathCionz</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#preview" className="hover:text-white transition-colors">Preview</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>

      <Link 
        to="/app"
        className="px-5 py-2 text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
      >
        Try App
      </Link>
    </motion.nav>
  )
}
