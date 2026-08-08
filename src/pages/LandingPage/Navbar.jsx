import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CloudSun } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-4 right-4 md:left-8 md:right-8 z-50 flex items-center justify-between px-8 py-4 glass-panel rounded-full"
    >
      <div className="flex items-center gap-3 w-48">
        <CloudSun className="w-8 h-8 text-sage-main" />
        <span className="text-xl font-bold font-display text-sage-dark">WeathCionz</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-sage-dark/70">
        <a href="#features" className="hover:text-sage-dark transition-colors">Features</a>
        <a href="#preview" className="hover:text-sage-dark transition-colors">Preview</a>
        <a href="#faq" className="hover:text-sage-dark transition-colors">FAQ</a>
      </div>

      <div className="w-48 flex justify-end">
        <Link 
          to="/app"
          className="px-6 py-2.5 text-sm font-bold bg-sage-dark text-white rounded-xl hover:bg-sage-dark/80 transition-colors inline-flex items-center gap-2 shadow-md shadow-sage-dark/20"
        >
          Launch App
        </Link>
      </div>
    </motion.nav>
  )
}
