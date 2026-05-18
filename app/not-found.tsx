import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-6 text-white overflow-hidden">
      <div className="max-w-md w-full text-center space-y-10">
        {/* Logo + Visual */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <Image
              src="/rhythme.svg"
              alt="Rhythmé"
              width={80}
              height={80}
              className="opacity-90"
              priority
            />
            
            {/* Subtle compass rings */}
            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_25s_linear_infinite]" />
            <div className="absolute inset-3 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-7xl font-serif font-light tracking-tighter text-white/90">
            404
          </h1>
          
          <h2 className="text-3xl font-medium text-white">
            Outside the Flow
          </h2>
          
          <p className="text-lg text-white/60 max-w-sm mx-auto leading-relaxed">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl 
                     bg-white text-black font-medium hover:bg-white/90 
                     transition-all active:scale-[0.985]"
          >
            Return Home
          </Link>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl 
                     border border-white/20 hover:bg-white/5 
                     transition-all font-medium"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-xs text-white/40 pt-8">
          Still lost? Try refreshing the page.
        </p>
      </div>
    </div>
  );
}