import Link from 'next/link'

export function AmplecenLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex items-center justify-center">
        <img
          src="/amplecen.svg"
          alt="Amplecen Logo"
          width={size === 'lg' ? 48 : size === 'md' ? 36 : 28}
          height={size === 'lg' ? 48 : size === 'md' ? 36 : 28}
          className="transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-ember/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={`
          ${sizeClasses[size]} font-amp-display font-light tracking-tight 
          text-foreground transition-colors duration-300
          group-hover:text-primary
        `}>
          Amplecen
        </span>
        <span className="text-[10px] font-amp-sans font-bold uppercase text-muted-foreground group-hover:text-accent transition-colors">
          ID
        </span>
      </div>
    </Link>
  )
}
