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
        className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
      >
        <div className="flex-1 w-full text-left flex flex-col items-start z-10 mt-12 lg:mt-0">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/5 mb-6 text-sky-400 font-medium text-sm">
            <span className="live-dot" /> Live Global Weather
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold font-display text-white leading-[1.1] mb-6 tracking-tighter">
            Global Weather<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
              Prediction at Your Fingertips
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
            Increase your awareness with real-time global weather tracking. WeathCionz brings you the most beautiful and accurate real-time forecasting experience with interactive 3D maps.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link 
              to="/app"
              className="px-10 py-5 text-lg font-bold rounded-full btn-primary hover:-translate-y-1 inline-flex items-center gap-2"
            >
              Lihat Cuaca Sekarang
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex-1 w-full max-w-sm hidden lg:block mx-auto">
          <LiquidGlassCard 
            draggable={true}
            blurIntensity="xl" 
            shadowIntensity="md"
            glowIntensity="md"
            borderRadius="32px"
            className="w-full p-8 flex flex-col items-center justify-between glass-dark border border-white/10 relative overflow-hidden shadow-2xl"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-transparent pointer-events-none" />
            
            <div className="w-full flex justify-between items-start text-white relative z-10">
              <div>
                <p className="text-sm font-medium text-white/60">Currently</p>
                <p className="text-2xl font-bold font-display tracking-tight">New York</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <CloudSun className="w-8 h-8 text-sky-300" />
              </div>
            </div>

            <div className="text-center my-12 relative z-10">
              <h2 className="text-8xl font-bold font-display text-white tracking-tighter drop-shadow-lg">
                72°
              </h2>
              <p className="text-xl text-sky-200 mt-2 font-medium">Partly Cloudy</p>
            </div>

            <div className="w-full grid grid-cols-3 gap-3 relative z-10">
              {[
                { time: '10 AM', icon: Sun, temp: '74°', color: 'text-yellow-400' },
                { time: '11 AM', icon: CloudSun, temp: '76°', color: 'text-sky-300' },
                { time: '12 PM', icon: CloudRain, temp: '71°', color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl glass-dark border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-xs text-white/60 font-medium">{item.time}</span>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="text-sm font-bold text-white">{item.temp}</span>
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
