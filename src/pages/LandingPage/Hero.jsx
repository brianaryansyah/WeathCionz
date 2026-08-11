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
      {/* Removed dynamic background elements (gradients/blurs) for a clean, non-AI-slop look */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-sage-bg" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-8 md:gap-12"
      >
        <div className="w-[55%] sm:w-[60%] md:flex-1 text-left flex flex-col items-start z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sage-light/30 border border-sage-main/20 mb-4 md:mb-6 text-sage-dark font-medium text-[10px] md:text-sm">
            <span className="live-dot" /> Live Global Weather
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-display leading-[1.1] mb-3 md:mb-6 tracking-tighter flex flex-wrap gap-x-1 sm:gap-x-3 md:gap-x-4 gap-y-1 items-center"
          >
            {[
              { text: 'Global', color: 'text-sage-dark' },
              { text: 'Weather', color: 'text-sage-main' } // Made "Weather" distinct
            ].map((word, i) => (
              <motion.span 
                key={`line1-${i}`}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 8, delay: i * 0.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, color: '#6b9e86', transition: { duration: 0.2 } }}
                className={`inline-block cursor-pointer transition-colors duration-300 ${word.color}`}
              >
                {word.text}
              </motion.span>
            ))}
            <div className="w-full basis-full h-0 block" /> {/* Force Line break for Prediction on all screens */}
            {[
              { text: 'Prediction', color: 'text-sage-dark' },
              { text: 'at', color: 'text-sage-dark' },
              { text: 'Your', color: 'text-sage-dark' },
              { text: 'Fingertips', color: 'text-sage-dark' }
            ].map((word, i) => (
              <motion.span 
                key={`line2-${i}`}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 8, delay: (i + 2) * 0.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, color: '#6b9e86', transition: { duration: 0.2 } }}
                className={`inline-block cursor-pointer transition-colors duration-300 ${word.color}`}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-xs sm:text-sm md:text-lg text-sage-dark/80 mb-6 md:mb-10 max-w-xl leading-relaxed">
            Increase your awareness with real-time global weather tracking. WeathCionz brings you the most beautiful and accurate real-time forecasting experience with interactive 3D maps.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 w-full">
            <Link 
              to="/app"
              className="px-4 py-3 md:px-8 md:py-4 text-xs md:text-base font-bold rounded-xl md:rounded-2xl btn-primary hover:-translate-y-1 inline-flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center shadow-xl shadow-sage-main/20"
            >
              <CloudSun className="w-5 h-5 md:w-6 md:h-6" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[8px] md:text-[10px] uppercase tracking-wider font-medium opacity-90 leading-none">Available Now</span>
                <span className="leading-none mt-1 text-white">Launch App</span>
              </div>
            </Link>
            <a 
              href="#features"
              className="px-4 py-3 md:px-8 md:py-4 text-xs md:text-base font-bold rounded-xl md:rounded-2xl bg-white hover:bg-sage-bg transition-colors inline-flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center border border-sage-main/20 shadow-sm text-sage-dark hover:-translate-y-1"
            >
              <Sun className="w-5 h-5 md:w-6 md:h-6 text-sage-main" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[8px] md:text-[10px] uppercase tracking-wider font-medium text-sage-dark/60 leading-none">Explore</span>
                <span className="leading-none mt-1">Features</span>
              </div>
            </a>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="w-[45%] sm:w-[40%] md:flex-1 flex items-center justify-end">
          <GlobeAnimation className="w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
