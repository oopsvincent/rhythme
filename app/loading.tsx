import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-black/90 via-neutral-900 to-[#0b0b0f] text-white overflow-hidden"
      aria-busy="true"
      aria-label="Loading Rhythmé"
    >
      {/* Center container */}
      <div className="relative z-20 flex flex-col items-center gap-4 px-6">
        {/* Brand + tagline */}
        <div className="text-center">
          <div className="mx-auto mb-3 w-20 h-20 flex items-center justify-center rounded-full bg-white/3 backdrop-blur-sm ring-1 ring-white/6">
            {/* simple monogram / brand mark */}
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#FF6B35" />
                  <stop offset="1" stopColor="#FFB195" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="22" fill="none" stroke="url(#g1)" strokeWidth="2" />
              <path d="M14 30 L24 16 L34 30" fill="none" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="mb-1 text-2xl font-semibold tracking-tight">Rhythmé</h1>
          <p className="text-sm opacity-70 italic">Aligning your day — one beat at a time</p>
        </div>

        {/* Creative shutter + film ring */}
        <div className="relative w-64 h-64">
          {/* rotating film strip ring (behind) */}
          <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full -z-10">
            <g className="film-rotate" transform="translate(110 110)">
              {/* ring */}
              <circle r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10"/>
              {/* sprocket holes */}
              {Array.from({length:12}).map((_, i) => {
                const angle = (i * 360) / 12;
                return (
                  <rect
                    key={i}
                    x="-6"
                    y={-92}
                    width="12"
                    height="8"
                    rx="1"
                    transform={`rotate(${angle}) translate(0,0)`}
                    fill="rgba(255,255,255,0.06)"
                  />
                );
              })}
            </g>
          </svg>

          {/* Shutter SVG (same core blades) */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            aria-hidden="true"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="vignette" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0.008)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </radialGradient>

              <mask id="apertureMask">
                <rect width="100%" height="100%" fill="white" />
                <circle id="apertureHole" cx="100" cy="100" r="70" fill="black" />
              </mask>

              {/* small lens highlight */}
              <radialGradient id="flare" cx="30%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
                <stop offset="30%" stopColor="rgba(255,255,255,0.18)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="98" fill="url(#vignette)" />

            <g id="blades" transform="translate(100 100)">
              {Array.from({ length: 6 }).map((_, i) => {
                const rotate = (i * 360) / 6;
                return (
                  <g
                    key={i}
                    transform={`rotate(${rotate}) translate(-100, -100)`}
                    className={`blade blade-${i}`}
                  >
                    <path
                      d="M100 40 C120 40 145 70 120 120 C100 160 20 160 20 100 C20 60 60 40 100 40 Z"
                      fill="rgba(15,15,20,0.95)"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}
            </g>

            <g mask="url(#apertureMask)">
              <circle cx="100" cy="100" r="62" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="50" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </g>

            {/* lens flare overlay (subtle, animated via css) */}
            <circle cx="68" cy="68" r="22" fill="url(#flare)" className="lens-flare" />
          </svg>
        </div>

        {/* Progress / microcopy row */}
        <div className="w-full max-w-xs mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs opacity-70">Syncing presets</span>
            <span className="text-xs opacity-60">42%</span>
          </div>

          {/* Skeleton bar (thin) */}
          <div className="h-2 w-full rounded-full bg-white/6 overflow-hidden">
            <Skeleton className="h-2 w-3/5 rounded-full" />
          </div>

          <p className="mt-2 text-[11px] opacity-60 text-center">Optimizing rhythm • Connecting to cloud</p>
        </div>
      </div>


    </div>
  );
}
