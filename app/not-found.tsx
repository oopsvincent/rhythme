export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0f] flex items-center justify-center text-white">
      {/* Background 404 monogram */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="notfound-giant opacity-[0.03] select-none">404</div>
      </div>

      {/* Horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] notfound-horizon pointer-events-none"></div>

      {/* Floating particles */}
      <div className="notfound-particles pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-20 px-6 max-w-2xl w-full text-center animate-notfound-fadein">

        {/* Logo + Compass block */}
        <div className="relative mx-auto mb-8 w-40 h-40 flex items-center justify-center">
          {/* Logo (from public/rhythme.svg) */}
          <img
            src="/rhythme.svg"
            alt="Rhythmé"
            className="notfound-logo w-20 h-20 md:w-24 md:h-24"
            width={96}
            height={96}
          />

          {/* Compass ring sits behind the logo for depth */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="notfound-compass" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-4 notfound-title">
          Lost in the Rhythm
        </h1>

        <p className="text-base md:text-lg text-white/70 mb-10 leading-relaxed">
          The page you’re seeking doesn’t exist — or it took a detour.  
          We’ll guide you back to the flow.
        </p>

        {/* CTA */}
        <a
          href="/"
          className="inline-block mt-4 px-8 py-3 text-sm md:text-base font-medium rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20 notfound-cta"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
