import { CloudSun } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border mt-24 bg-background">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold font-display text-foreground">WeathCionz</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} WeathCionz. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
