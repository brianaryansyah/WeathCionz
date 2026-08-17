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

      {/* Sidebar - Mobile Bottom, Desktop Left */}
      <aside className="fixed bottom-0 left-0 w-full h-[76px] lg:static lg:w-[100px] lg:h-full flex-shrink-0 bg-white/95 lg:bg-white/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-slate-200 lg:border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:shadow-[2px_0_15px_rgba(0,0,0,0.02)] z-[60] order-2 lg:order-1">
        {sidebar}
      </aside>
    </div>
  );
}
