import { motion } from 'motion/react'
import { Map, Zap, ShieldCheck } from 'lucide-react'

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
    icon: ShieldCheck,
    title: 'Professional Accuracy',
    description: 'Data sourced from authoritative meteorological networks for the most reliable forecasts.'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 relative z-10 bg-background">
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
            Intelligent Forecasting. <span className="text-primary">No Compromises.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Say goodbye to clunky interfaces. WeathCionz brings weather to life with an experience designed for clarity and precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 minimal-card group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-primary/20">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold font-display text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
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
