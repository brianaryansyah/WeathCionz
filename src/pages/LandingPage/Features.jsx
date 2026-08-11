import { motion } from 'motion/react'
import { Map, Zap, Layers } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Lightning fast weather updates with sub-minute latency. Always know exactly what is happening right now.'
  },
  {
    icon: Map,
    title: 'Interactive 3D Maps',
    description: 'Explore global weather patterns with our immersive MapLibre powered 3D visualizations.'
  },
  {
    icon: Layers,
    title: 'Premium Glassmorphism',
    description: 'A UI that adapts to the weather. Beautifully frosted glass overlays over dynamic sky backgrounds.'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 relative z-10">
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-sage-dark mb-6">
            Boring Weather Apps? <span className="text-sage-main">No More.</span>
          </h2>
          <p className="text-lg text-sage-dark/80 max-w-2xl mx-auto">
            Say goodbye to standard lists and flat icons. WeathCionz brings weather to life with an experience designed for the modern web.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                boxShadow: "0 30px 60px -15px rgba(107, 158, 134, 0.3)",
                borderColor: "rgba(107, 158, 134, 0.4)",
                transition: { type: 'spring', stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.95 }}
              className="p-8 rounded-3xl glass-panel group relative overflow-hidden border border-sage-main/10 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sage-main/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-sage-light/30 flex items-center justify-center mb-6 group-hover:bg-sage-main/20 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-sage-main group-hover:text-sage-dark transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold font-display text-sage-dark mb-4 group-hover:-translate-y-1 transition-transform duration-300">{feature.title}</h3>
                <p className="text-sage-dark/80 leading-relaxed group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
