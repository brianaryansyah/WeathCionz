import { CloudSun } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 mt-24">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-sky-500" />
          <span className="text-lg font-bold font-display text-white">WeathCionz</span>
        </div>
        
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} WeathCionz. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
