import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { LiquidGlassCard } from '../../components/ui/liquid-weather-glass'
import { CloudSun, CloudRain, Sun } from 'lucide-react'

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
    <section className="relative pt-48 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16"
      >
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sky-400 font-medium text-sm">
            <span className="live-dot" /> Live Global Weather
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold font-display text-white leading-tight mb-6 tracking-tight">
            Predict the Sky.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              Own the Day.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
            WeathCionz brings you the most beautiful and accurate real-time weather forecasting experience. Explore interactive 3D maps and hourly insights wrapped in a premium glassmorphism interface.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link 
              to="/app"
              className="px-8 py-4 text-base font-semibold rounded-full btn-primary hover:scale-105 transition-transform"
            >
              Lihat Cuaca Sekarang
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex-1 w-full max-w-md hidden md:block">
          <LiquidGlassCard 
            draggable={false}
            blurIntensity="xl" 
            shadowIntensity="md"
            glowIntensity="sm"
            borderRadius="32px"
            className="w-full aspect-[4/5] p-8 flex flex-col items-center justify-between bg-white/5 border border-white/10 relative overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-transparent pointer-events-none" />
            
            <div className="w-full flex justify-between items-start text-white/90">
              <div>
                <p className="text-sm font-medium">Currently</p>
                <p className="text-2xl font-bold font-display">New York</p>
              </div>
              <CloudSun className="w-10 h-10 text-sky-400" />
            </div>

            <div className="text-center my-8">
              <h2 className="text-8xl font-bold font-display text-white tracking-tighter">
                72°
              </h2>
              <p className="text-xl text-white/70 mt-2">Partly Cloudy</p>
            </div>

            <div className="w-full grid grid-cols-3 gap-2">
              {[
                { time: '10 AM', icon: Sun, temp: '74°' },
                { time: '11 AM', icon: CloudSun, temp: '76°' },
                { time: '12 PM', icon: CloudRain, temp: '71°' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs text-white/60">{item.time}</span>
                  <item.icon className="w-5 h-5 text-white/80" />
                  <span className="text-sm font-semibold text-white">{item.temp}</span>
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
