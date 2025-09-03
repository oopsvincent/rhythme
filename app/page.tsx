import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center bg-background overflow-hidden">
      {/* Title */}
      <h1 className="text-8xl font-head text-primary drop-shadow-lg">
        Hello, Rhythmé
      </h1>
      <p className="text-2xl font-body text-accent mt-4">
        The Ultimate Productivity Ecosystem
      </p>

      {/* Tagline */}
      <p className="text-lg font-body text-text-primary mt-2 max-w-xl px-2">
        Align your habits, focus, mental health and growth — all in one seamless experience.
      </p>

      {/* Coming soon */}
      <p className="mt-6 text-sm font-mono uppercase tracking-wider text-foreground/70">
        Coming September 2026
      </p>

      {/* Decorative graphics */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>

      {/* Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-64"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            className="text-accent"
            d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
      <div className="absolute -bottom-5 left-0 right-0">
        <svg
          className="w-full h-64"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            className="text-primary"
            d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}
