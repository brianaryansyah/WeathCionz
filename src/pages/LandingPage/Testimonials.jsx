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
    content: 'Finally, a weather app that prioritizes clarity. The interface is stunning without being overwhelming.'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Event Planner',
    content: 'The 3D interactive maps give me the confidence to assure my clients about outdoor venues. Highly recommended!'
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative z-10 bg-background">
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
            Loved by <span className="text-primary">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our users are saying about the new standard in weather tracking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="minimal-card p-8 relative"
            >
              <Quote className="w-8 h-8 text-primary/10 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-foreground font-semibold">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
