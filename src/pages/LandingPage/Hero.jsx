import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import GlobeAnimation from '../../components/ui/GlobeAnimation'
import { CloudSun, Sun } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative pt-40 md:pt-48 pb-20 md:pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
      >
        <div className="flex-1 w-full text-left flex flex-col items-start z-10 mt-12 lg:mt-0">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6 text-sky-600 font-medium text-sm">
            <span className="live-dot" /> Live Global Weather
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold font-display text-slate-900 leading-[1.1] mb-6 tracking-tighter">
            Global Weather<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
              Prediction at Your Fingertips
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Increase your awareness with real-time global weather tracking. WeathCionz brings you the most beautiful and accurate real-time forecasting experience with interactive 3D maps.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/app"
              className="px-8 py-4 text-base font-bold rounded-2xl btn-primary hover:-translate-y-1 inline-flex items-center gap-3 w-full sm:w-auto justify-center shadow-xl shadow-sky-500/20"
            >
              <CloudSun className="w-6 h-6" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-wider font-medium opacity-90 leading-none">Available Now</span>
                <span className="leading-none mt-1 text-white">Launch Web App</span>
              </div>
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 text-base font-bold rounded-2xl bg-white hover:bg-slate-50 transition-colors inline-flex items-center gap-3 w-full sm:w-auto justify-center border border-slate-200 shadow-sm text-slate-900 hover:-translate-y-1"
            >
              <Sun className="w-6 h-6 text-sky-500" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-wider font-medium text-slate-500 leading-none">Explore</span>
                <span className="leading-none mt-1">View Features</span>
              </div>
            </a>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex-1 w-full flex items-center justify-center lg:justify-end">
          <GlobeAnimation className="w-full max-w-[500px]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
