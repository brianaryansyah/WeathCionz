import React from 'react';

export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#f3f6f8] overflow-hidden font-sans text-slate-800 relative">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-sky-300/10 blur-[100px] mix-blend-multiply" style={{ animation: 'spin-slow 60s linear infinite' }} />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-orange-300/10 blur-[100px] mix-blend-multiply" style={{ animation: 'spin-slow 80s linear infinite reverse' }} />
      </div>
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="w-full md:w-[100px] h-[80px] md:h-full flex-shrink-0 bg-white/90 backdrop-blur-xl border-t md:border-t-0 md:border-r border-slate-200 shadow-[0_-2px_15px_rgba(0,0,0,0.05)] md:shadow-[2px_0_15px_rgba(0,0,0,0.02)] z-[60] order-last md:order-first fixed bottom-0 left-0 right-0 md:static">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative pb-[80px] md:pb-0 w-full">
        {/* Header */}
        <header className="w-full px-4 md:px-8 py-4 md:py-6 z-50 sticky top-0 bg-[#f3f6f8]/90 backdrop-blur-md">
          {header}
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 px-4 md:px-8 pb-8">
          <div className="grid grid-cols-12 gap-4 md:gap-6 h-full min-h-[700px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
