import { motion } from 'motion/react'
import { LiquidGlassCard } from "../../components/ui/liquid-weather-glass";
import {
  Cloud,
  CloudSun,
  CloudRain,
  Sun,
  MapPin,
  CloudSunRain,
} from 'lucide-react';

export default function Preview() {
  return (
    <section id="preview" className="py-24 px-6 relative z-10">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Experience the UI
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Drag, hover, and interact with our Liquid Glass components. Built with Motion for React.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 w-full gap-8 py-16 rounded-[40px] overflow-hidden"
          style={{
            background: 'url("https://images.unsplash.com/photo-1590867286251-8e26d9f255c0?q=80&w=1200&auto=format&fit=crop") center / cover no-repeat',
          }}
        >
          <div className="grid w-full max-w-xl grid-cols-2 gap-4 mx-auto">
            {/* Hourly Forecast Card */}
            <LiquidGlassCard
              shadowIntensity="xs"
              borderRadius="16px"
              glowIntensity="none"
              className="col-span-2 p-6 text-white bg-white/10"
            >
              <div className="flex justify-between text-sm font-medium">
                <div className="flex flex-col items-center gap-2">
                  <span>16:00</span>
                  <Cloud className="h-6 w-6 fill-white" />
                  <span>+18°</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span>17:00</span>
                  <Cloud className="h-6 w-6 fill-white" />
                  <span>+18°</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span>18:00</span>
                  <CloudRain className="h-6 w-6" />
                  <span>+16°</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span>19:00</span>
                  <CloudRain className="h-6 w-6" />
                  <span>+14°</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span>20:00</span>
                  <CloudSun className="h-6 w-6 fill-white" />
                  <span>+15°</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span>21:00</span>
                  <CloudSunRain className="h-6 w-6" />
                  <span>+14°</span>
                </div>
              </div>
            </LiquidGlassCard>

            {/* Current Weather Card */}
            <LiquidGlassCard
              shadowIntensity="xs"
              borderRadius="16px"
              glowIntensity="none"
              className="p-6 text-white bg-white/10 flex flex-col items-start justify-center aspect-square"
            >
              <div className="text-5xl font-semibold">+18°C</div>
              <div className="text-sm mt-2 text-white/80">Cloudy +18°/+5°</div>
            </LiquidGlassCard>

            {/* Time and Location Card */}
            <LiquidGlassCard
              shadowIntensity="xs"
              borderRadius="16px"
              glowIntensity="none"
              className="p-6 text-white bg-white/10 flex flex-col items-start justify-center aspect-square"
            >
              <div className="text-5xl font-semibold">17:32</div>
              <div className="text-sm mt-2 text-white/80">Sun, November 19</div>
              <button className="mt-4 inline-flex items-center gap-1 rounded-full bg-black/20 backdrop-blur-md px-3 py-1.5 text-xs font-medium border border-white/10">
                <MapPin className="h-3 w-3" />
                Tbilisi
              </button>
            </LiquidGlassCard>

            {/* Daily Forecast Card */}
            <LiquidGlassCard
              shadowIntensity="xs"
              borderRadius="16px"
              glowIntensity="none"
              className="col-span-2 bg-white/10 p-6 text-white flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <span className="font-medium">Tue, 7 Sep</span>
                </div>
                <span className="font-semibold">+18° <span className="text-white/50 font-normal">/+4°</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-white fill-white" />
                  <span className="font-medium">Wed, 8 Sep</span>
                </div>
                <span className="font-semibold">+20° <span className="text-white/50 font-normal">/+6°</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudRain className="h-5 w-5 text-blue-300" />
                  <span className="font-medium">Thu, 9 Sep</span>
                </div>
                <span className="font-semibold">+17° <span className="text-white/50 font-normal">/+3°</span></span>
              </div>
            </LiquidGlassCard>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
