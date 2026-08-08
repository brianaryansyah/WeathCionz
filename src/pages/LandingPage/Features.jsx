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
          <h2 className="text-3xl md:text-5xl font-bold font-display text-sage-dark mb-6">
            Boring Weather Apps? <span className="text-sage-main">No More.</span>
          </h2>
          <p className="text-lg text-sage-dark/80 max-w-2xl mx-auto">
            Say goodbye to standard lists and flat icons. WeathCionz brings weather to life with an experience designed for the modern web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-3xl glass-panel glass-panel-hover group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sage-main/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-sage-light/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-sage-main" />
                </div>
                
                <h3 className="text-xl font-bold font-display text-sage-dark mb-4">{feature.title}</h3>
                <p className="text-sage-dark/80 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
