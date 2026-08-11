import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is WeathCionz free to use?',
    a: 'Yes! WeathCionz uses the free Open-Meteo API to bring you accurate weather data without any subscription fees.'
  },
  {
    q: 'Does it work globally?',
    a: 'Absolutely. Our maps and data cover every coordinate on Earth.'
  },
  {
    q: 'How often is the data updated?',
    a: 'Data is updated in real-time, pulling the latest hourly forecast models available.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 px-6 relative z-10">
      <div className="container max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-sage-dark mb-6">
            Frequently Asked <span className="text-sage-main">Questions</span>
          </h2>
          <p className="text-lg text-sage-dark/80 max-w-2xl mx-auto">
            Everything you need to know about WeathCionz and how it works.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div 
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="glass-panel overflow-hidden rounded-2xl transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-bold font-display text-sage-dark pr-8">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-sage-main" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6"
                    >
                      <p className="text-sage-dark/80 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
