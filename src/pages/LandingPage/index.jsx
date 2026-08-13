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
    <div className="min-h-screen bg-background font-sans overflow-x-hidden relative text-foreground">
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
