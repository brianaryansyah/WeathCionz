import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CloudSun } from 'lucide-react'

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 glass-header shadow-sm' 
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 w-48 group">
          <CloudSun className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-105" />
          <span className="text-xl font-bold font-display text-foreground tracking-tight">WeathCionz</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-foreground transition-colors">
            Preview
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>

        <div className="w-48 flex justify-end">
          <Link 
            to="/app"
            className="px-5 py-2.5 text-sm font-semibold btn-primary inline-flex items-center gap-2 shadow-sm"
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  )
}
