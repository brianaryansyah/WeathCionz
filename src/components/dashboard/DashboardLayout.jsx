import React from 'react';

export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-screen bg-[#f3f6f8] overflow-hidden font-sans text-slate-800 relative">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative order-1 lg:order-2 pb-20 lg:pb-0">
        {/* Header */}
        <header className="w-full px-5 lg:px-8 py-5 lg:py-6 z-50 sticky top-0 bg-[#f3f6f8]/90 backdrop-blur-md">
          {header}
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 px-5 lg:px-8 pb-6 lg:pb-8">
          <div className="grid grid-cols-12 gap-5 lg:gap-6 h-full min-h-[700px]">
            {children}
          </div>
        </div>
      </main>

      {/* Sidebar - Mobile Bottom Floating Pill, Desktop Left */}
      <aside className="fixed lg:static bottom-5 left-5 right-5 h-[72px] lg:bottom-0 lg:left-0 lg:right-auto lg:w-[100px] lg:h-full flex-shrink-0 bg-[#151515] lg:bg-white/80 lg:backdrop-blur-xl lg:border-r lg:border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.2)] lg:shadow-[2px_0_15px_rgba(0,0,0,0.02)] z-[60] order-2 lg:order-1 rounded-full lg:rounded-none border border-white/10 lg:border-none">
        {sidebar}
      </aside>
    </div>
  );
}
