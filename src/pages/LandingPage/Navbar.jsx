import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CloudSun } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-4 bg-sage-bg/80 backdrop-blur-lg border-b border-sage-main/10 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 w-48 group">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
            <CloudSun className="w-8 h-8 text-sage-main group-hover:text-sage-dark transition-colors" />
          </motion.div>
          <span className="text-xl font-bold font-display text-sage-dark tracking-tight">WeathCionz</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-sage-dark/80">
          <a href="#features" className="relative group hover:text-sage-dark transition-colors">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-main transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#preview" className="relative group hover:text-sage-dark transition-colors">
            Preview
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-main transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#faq" className="relative group hover:text-sage-dark transition-colors">
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-main transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <div className="w-48 flex justify-end">
          <Link 
            to="/app"
            className="px-6 py-2.5 text-sm font-bold bg-sage-dark text-white rounded-xl hover:bg-sage-main hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sage-main/30 transition-all duration-300 inline-flex items-center gap-2 shadow-md shadow-sage-dark/20"
          >
            Launch App
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
