export type BackgroundMode = 'light' | 'dark'

export type Background = {
  id: string
  name: string
  mode: BackgroundMode
  containerClass: string
  cardClass: string
  ringClass: string
  btnClass: string
  swatchClass: string
}

export const BACKGROUNDS: Background[] = [
  // ==================== LIGHT MODE ====================
  { 
    id: 'warm-studio', 
    name: 'Warm Studio', 
    mode: 'light',
    containerClass: 'bg-[#f8f1e9] text-stone-800', 
    cardClass: 'border-amber-200/60 bg-white/90 shadow-xl backdrop-blur-md', 
    ringClass: 'text-amber-800', 
    btnClass: 'border-amber-200 bg-white/80 text-stone-700 hover:bg-amber-50 hover:text-amber-800',
    swatchClass: 'bg-[#f8f1e9] border-amber-300' 
  },
  { 
    id: 'linen-room', 
    name: 'Linen Room', 
    mode: 'light',
    containerClass: 'bg-[#f9f5f0] text-stone-800', 
    cardClass: 'border-stone-300/70 bg-white/95 shadow-xl backdrop-blur-sm', 
    ringClass: 'text-stone-700', 
    btnClass: 'border-stone-300 bg-white/90 text-stone-700 hover:bg-stone-100',
    swatchClass: 'bg-[#f9f5f0] border-stone-400' 
  },
  { 
    id: 'cream-coffee', 
    name: 'Cream & Coffee', 
    mode: 'light',
    containerClass: 'bg-[#f5f0e8] text-stone-800', 
    cardClass: 'border-amber-200/50 bg-white/90 shadow-xl backdrop-blur-md', 
    ringClass: 'text-amber-900', 
    btnClass: 'border-amber-200 bg-white/80 text-stone-700 hover:bg-amber-50',
    swatchClass: 'bg-[#f5f0e8] border-amber-300' 
  },
  { 
    id: 'soft-sand', 
    name: 'Soft Sand', 
    mode: 'light',
    containerClass: 'bg-[#f4ede4] text-stone-800', 
    cardClass: 'border-stone-200 bg-white/90 shadow-xl backdrop-blur-md', 
    ringClass: 'text-stone-700', 
    btnClass: 'border-stone-200 bg-white/80 text-stone-700 hover:bg-stone-100',
    swatchClass: 'bg-[#f4ede4] border-stone-300' 
  },
  {
    id: 'morning-paper',
    name: 'Morning Paper',
    mode: 'light',
    containerClass: 'bg-[#faf9f6] text-stone-800',
    cardClass: 'border-stone-200/60 bg-white/85 shadow-lg backdrop-blur-sm',
    ringClass: 'text-stone-600',
    btnClass: 'border-stone-200 bg-white/75 text-stone-600 hover:bg-white',
    swatchClass: 'bg-[#faf9f6] border-stone-300'
  },
  {
    id: 'gentle-oak',
    name: 'Gentle Oak',
    mode: 'light',
    containerClass: 'bg-[#f2efe9] text-stone-900',
    cardClass: 'border-amber-900/10 bg-white/90 shadow-xl backdrop-blur-md',
    ringClass: 'text-amber-900/80',
    btnClass: 'border-amber-900/10 bg-white/80 text-stone-700 hover:bg-amber-50',
    swatchClass: 'bg-[#f2efe9] border-amber-200'
  },
  {
    id: 'golden-hour-light',
    name: 'Golden Hour',
    mode: 'light',
    containerClass: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-amber-900',
    cardClass: 'border-orange-200/60 bg-white/75 shadow-xl backdrop-blur-xl',
    ringClass: 'text-orange-600',
    btnClass: 'border-orange-200 bg-white/70 text-amber-900 hover:bg-white/90',
    swatchClass: 'bg-gradient-to-br from-amber-100 to-orange-200 border-orange-300'
  },
  {
    id: 'moss-window',
    name: 'Moss Window',
    mode: 'light',
    containerClass: 'bg-[#f1f4f0] text-emerald-950',
    cardClass: 'border-emerald-200/60 bg-white/85 shadow-xl backdrop-blur-md',
    ringClass: 'text-emerald-700',
    btnClass: 'border-emerald-200 bg-white/75 text-emerald-800 hover:bg-emerald-50',
    swatchClass: 'bg-[#e2eadf] border-emerald-300'
  },

  // ==================== DARK MODE ====================
  {
    id: 'warm-ember',
    name: 'Warm Ember',
    mode: 'dark',
    containerClass: 'bg-[#1c1612] text-stone-100',
    cardClass: 'border-amber-900/50 bg-[#0f0b08]/80 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-amber-400',
    btnClass: 'border-amber-900/60 bg-black/50 text-stone-200 hover:bg-amber-950/70',
    swatchClass: 'bg-[#1c1612] border-amber-900/60'
  },
  {
    id: 'amber-study',
    name: 'Amber Study',
    mode: 'dark',
    containerClass: 'bg-gradient-to-br from-[#2a1f17] via-[#1f1610] to-[#18120c] text-amber-100',
    cardClass: 'border-amber-900/50 bg-black/40 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-amber-400',
    btnClass: 'border-amber-900/50 bg-black/50 text-amber-200 hover:bg-amber-950/60',
    swatchClass: 'bg-[#2a1f17] border-amber-800'
  },
  {
    id: 'deep-walnut',
    name: 'Deep Walnut',
    mode: 'dark',
    containerClass: 'bg-[#1e1813] text-stone-200',
    cardClass: 'border-amber-950/60 bg-[#14100c]/80 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-amber-300/90',
    btnClass: 'border-amber-950/50 bg-black/50 text-stone-300 hover:bg-amber-950/70',
    swatchClass: 'bg-[#1e1813] border-amber-900'
  },
  {
    id: 'foggy-hearth',
    name: 'Foggy Hearth',
    mode: 'dark',
    containerClass: 'bg-gradient-to-br from-[#25221e] to-[#1a1713] text-stone-200',
    cardClass: 'border-stone-700/50 bg-black/40 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-stone-400',
    btnClass: 'border-stone-700/60 bg-black/50 text-stone-300 hover:bg-stone-800/70',
    swatchClass: 'bg-[#25221e] border-stone-600'
  },
  {
    id: 'twilight-library',
    name: 'Twilight Library',
    mode: 'dark',
    containerClass: 'bg-gradient-to-br from-[#1f1b22] to-[#16141a] text-slate-200',
    cardClass: 'border-violet-950/40 bg-black/40 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-violet-300/90',
    btnClass: 'border-violet-950/50 bg-black/50 text-slate-300 hover:bg-violet-950/60',
    swatchClass: 'bg-[#1f1b22] border-violet-900'
  },
  {
    id: 'velvet-ember',
    name: 'Velvet Ember',
    mode: 'dark',
    containerClass: 'bg-gradient-to-br from-[#24160f] to-[#1a110c] text-amber-100',
    cardClass: 'border-amber-900/50 bg-black/45 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-amber-400',
    btnClass: 'border-amber-900/60 bg-black/50 text-amber-200 hover:bg-amber-950/70',
    swatchClass: 'bg-[#24160f] border-amber-800'
  },
  {
    id: 'soft-charcoal',
    name: 'Soft Charcoal',
    mode: 'dark',
    containerClass: 'bg-[#1f1f21] text-zinc-100',
    cardClass: 'border-zinc-700/50 bg-[#161618]/70 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-zinc-400',
    btnClass: 'border-zinc-700/50 bg-black/50 text-zinc-200 hover:bg-zinc-800',
    swatchClass: 'bg-[#1f1f21] border-zinc-600'
  },
  {
    id: 'moonlit-linen',
    name: 'Moonlit Linen',
    mode: 'dark',
    containerClass: 'bg-[#1c1d20] text-slate-200',
    cardClass: 'border-slate-700/50 bg-[#131417]/70 shadow-2xl backdrop-blur-xl',
    ringClass: 'text-slate-400',
    btnClass: 'border-slate-700/50 bg-black/50 text-slate-300 hover:bg-slate-800/70',
    swatchClass: 'bg-[#1c1d20] border-slate-600'
  }
]

export const getBackgroundsForMode = (mode: BackgroundMode) => 
  BACKGROUNDS.filter(bg => bg.mode === mode)

export const getBackgroundById = (id: string) => 
  BACKGROUNDS.find(bg => bg.id === id)

export const getDefaultBackground = (mode: BackgroundMode) => {
  const defaults = {
    light: 'warm-studio',
    dark: 'warm-ember'
  }
  return BACKGROUNDS.find(bg => bg.id === defaults[mode]) || BACKGROUNDS[0]
}
