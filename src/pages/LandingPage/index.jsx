import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import Preview from './Preview'
import Testimonials from './Testimonials'
import FAQ from './FAQ'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050B14] font-sans selection:bg-sky-500/30 overflow-x-hidden relative selection:text-white">
      {/* Global Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-sky-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Features />
        <Preview />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
