import { motion } from 'motion/react'
import { Quote } from 'lucide-react'

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
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Loved by <span className="text-sky-600">Meteorologists</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what professionals are saying about WeathCionz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glass-panel p-8 rounded-3xl relative"
            >
              <Quote className="w-10 h-10 text-sky-100 absolute top-6 right-6 opacity-50" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
