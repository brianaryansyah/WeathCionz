import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import GlobeAnimation from '../../components/ui/GlobeAnimation'
import { CloudSun, ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <section className="relative pt-40 md:pt-48 pb-20 md:pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10 bg-background" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
      >
        <div className="w-full md:w-[55%] text-left flex flex-col items-start z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary font-semibold text-[11px] md:text-sm tracking-wide uppercase">
            <span className="live-dot" /> Live Global Weather
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-6 tracking-tight text-foreground"
          >
            Predict the weather with <span className="text-primary">absolute precision.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-sm md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
            Increase your awareness with real-time global weather tracking. WeathCionz brings you an accurate and professional forecasting experience with interactive 3D maps.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <Link 
              to="/app"
              className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-bold rounded-lg btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <CloudSun className="w-5 h-5 md:w-6 md:h-6" />
              <span>Launch App</span>
            </Link>
            <a 
              href="#features"
              className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-lg bg-white hover:bg-muted transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center border border-border text-foreground group"
            >
              Explore Features
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="w-full md:w-[45%] flex items-center justify-center md:justify-end mt-10 md:mt-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
            <GlobeAnimation className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
