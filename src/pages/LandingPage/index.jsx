import { MotionConfig } from 'motion/react'
import Navbar from './Navbar'
import Hero from './Hero'
import InfiniteMarquee from '../../components/ui/InfiniteMarquee'
import Features from './Features'
import Preview from './Preview'
import Testimonials from './Testimonials'
import FAQ from './FAQ'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-sky-500/20 overflow-x-hidden relative selection:text-slate-900 text-slate-800">
      {/* Global Ambient Glows (Light Mode) */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-sky-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <MotionConfig reducedMotion="user">
        <Navbar />
        <main>
          <Hero />
          <InfiniteMarquee />
          <Features />
          <Preview />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
      </MotionConfig>
    </div>
  )
}
