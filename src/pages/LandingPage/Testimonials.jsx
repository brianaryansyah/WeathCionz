import { motion } from 'motion/react'

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Travel Photographer',
    content: 'WeathCionz completely changed how I plan my shoots. The visual accuracy and hourly predictions are unmatched.'
  },
  {
    name: 'David Chen',
    role: 'Daily Commuter',
    content: 'Finally, a weather app that doesn\'t look like a spreadsheet from 2010. The glassmorphism UI is stunning.'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Event Planner',
    content: 'The 3D interactive maps give me the confidence to assure my clients about outdoor venues. Highly recommended!'
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Loved by <span className="text-sky-400">Thousands</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl flex flex-col justify-between"
            >
              <p className="text-white/80 italic mb-6 leading-relaxed">"{t.content}"</p>
              <div>
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-sm text-sky-400">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
