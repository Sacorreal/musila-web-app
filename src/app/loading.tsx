"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in duration-700">
        {/* Animated Logo Container */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping duration-[2000ms]" />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse duration-[1500ms]" />
          
          {/* Logo SVG (Recreated from image) */}
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 text-primary relative z-10 animate-bounce duration-[2000ms]"
            style={{ animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)' }}
          >
            {/* Headphones Arch */}
            <path
              d="M20 50 C 20 20, 80 20, 80 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Headphones Earcups */}
            <rect x="12" y="45" width="12" height="20" rx="4" fill="currentColor" />
            <rect x="76" y="45" width="12" height="20" rx="4" fill="currentColor" />
            
            {/* Stylized M */}
            <path
              d="M30 75 V 45 L 50 65 L 70 45 V 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Text Logo */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-3xl font-black tracking-tighter text-primary animate-pulse">
            Musila
          </h2>
          <div className="h-1 w-12 bg-primary/30 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/2 animate-shimmer" 
                 style={{ 
                   animation: 'shimmer 1.5s infinite linear',
                   backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                   backgroundSize: '200% 100%'
                 }} 
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
