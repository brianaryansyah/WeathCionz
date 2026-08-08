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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Boring Weather Apps? <span className="text-sky-400">No More.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Say goodbye to standard lists and flat icons. WeathCionz brings weather to life with an experience designed for the modern web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
