import { CloudRain, Sun, Wind, CloudLightning, Droplets, Map } from 'lucide-react'

export default function InfiniteMarquee() {
  const items = [
    { text: "Real-time Forecasting", icon: <Sun className="w-5 h-5 text-accent" /> },
    { text: "Global Coverage", icon: <Map className="w-5 h-5 text-emerald-400" /> },
    { text: "Interactive 3D Maps", icon: <Wind className="w-5 h-5 text-primary" /> },
    { text: "Severe Weather Alerts", icon: <CloudLightning className="w-5 h-5 text-accent" /> },
    { text: "Hyper-local Accuracy", icon: <Droplets className="w-5 h-5 text-secondary" /> },
  ]
  
  // Duplicating the items to create a seamless infinite loop effect
  const displayItems = [...items, ...items, ...items, ...items]

  return (
    <div className="w-full bg-foreground text-background py-5 overflow-hidden border-y border-foreground/10 relative flex items-center z-20">
      {/* Gradient masks on the edges to fade the text in and out smoothly */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-foreground to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-foreground to-transparent pointer-events-none" />
      
      <div className="flex w-max animate-marquee">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-8 text-sm md:text-base font-semibold font-display tracking-[0.15em] uppercase">
            {item.icon}
            <span className="opacity-90">{item.text}</span>
            <span className="text-muted-foreground/30 mx-6 text-xl">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
