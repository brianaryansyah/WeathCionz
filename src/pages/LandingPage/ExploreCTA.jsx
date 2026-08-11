import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Map, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function ExploreCTA() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <section className="py-24 px-6 relative z-10 bg-sage-50 border-t border-sage-main/10 overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-sage-main/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-sage-dark mb-6 tracking-tight">
            Find Your <span className="text-sage-main">Horizon</span>
          </h2>
          <p className="text-lg md:text-xl text-sage-dark/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Instantly search for any region worldwide or open our immersive, full-screen 3D weather dashboard. The power of global forecasting is just one click away.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-6 sm:pl-8 flex items-center pointer-events-none text-sage-main/60 group-focus-within:text-sage-main transition-colors">
              <Search className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-16 sm:pl-20 pr-32 sm:pr-40 py-5 sm:py-6 text-base sm:text-xl rounded-full bg-white border-2 border-sage-main/20 text-sage-dark placeholder:text-sage-dark/40 focus:outline-none focus:border-sage-main focus:ring-4 focus:ring-sage-main/10 transition-all shadow-xl shadow-sage-main/5"
              placeholder="Search for a city, region, or village..."
            />
            <button
              type="submit"
              className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 px-6 sm:px-8 bg-sage-main hover:bg-sage-dark text-white rounded-full font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <span>Search</span>
              <ArrowRight className="w-5 h-5 hidden sm:block" />
            </button>
          </form>

          <div className="mt-16">
             <div className="flex items-center justify-center gap-4 mb-8">
               <div className="h-px bg-sage-main/20 flex-1 max-w-[100px]"></div>
               <div className="text-xs font-bold text-sage-dark/40 uppercase tracking-widest">Or dive directly in</div>
               <div className="h-px bg-sage-main/20 flex-1 max-w-[100px]"></div>
             </div>
             
             <Link 
               to="/app"
               className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-sage-dark text-white font-bold text-sm sm:text-base hover:-translate-y-1 hover:shadow-2xl hover:shadow-sage-dark/30 transition-all"
             >
               <Map className="w-5 h-5 sm:w-6 sm:h-6 text-sage-main" />
               Launch Full-Screen Interactive Map
             </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
