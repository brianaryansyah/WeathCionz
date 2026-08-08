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
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Boring Weather Apps? <span className="text-sky-600">No More.</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="p-8 rounded-3xl glass-panel glass-panel-hover group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
