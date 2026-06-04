// lib/avatars.ts
// Static avatar registry — 16 hand-crafted SVG avatars
// Two categories: gradient orbs (glowing spheres) and geometric patterns

export interface AvatarOption {
  id: string
  category: "gradient" | "geometric"
  label: string
}

export const AVATAR_CATEGORIES = [
  { id: "gradient", label: "Gradient Orbs" },
  { id: "geometric", label: "Geometric" },
] as const

export const DEFAULT_AVATAR_ID = "gradient-violet"

// ============================================================================
// SVG DEFINITIONS — Gradient Orbs
// ============================================================================

const GRADIENT_SVGS: Record<string, string> = {
  "gradient-violet": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#5b21b6"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-coral": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#fca5a5"/><stop offset="1" stop-color="#dc2626"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-teal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0f766e"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-rose": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#fda4af"/><stop offset="1" stop-color="#be123c"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-emerald": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#6ee7b7"/><stop offset="1" stop-color="#047857"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-sky": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#1d4ed8"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-amber": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#fcd34d"/><stop offset="1" stop-color="#d97706"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,

  "gradient-lavender": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="o" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#ddd6fe"/><stop offset="1" stop-color="#6d28d9"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#o)"/><ellipse cx="36" cy="34" rx="11" ry="7" fill="#fff" opacity=".18"/></svg>`,
}

// ============================================================================
// SVG DEFINITIONS — Geometric Patterns
// ============================================================================

const GEOMETRIC_SVGS: Record<string, string> = {
  "geo-prism": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#1e1b4b"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><polygon points="50,15 85,75 15,75" fill="none" stroke="#818cf8" stroke-width="2" opacity=".7"/><polygon points="50,28 72,66 28,66" fill="none" stroke="#a78bfa" stroke-width="1.5" opacity=".5"/><polygon points="50,38 62,59 38,59" fill="#818cf8" opacity=".25"/></svg>`,

  "geo-hex": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#134e4a"/><stop offset="1" stop-color="#042f2e"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="#2dd4bf" stroke-width="2" opacity=".6"/><polygon points="50,32 64,40 64,60 50,68 36,60 36,40" fill="#2dd4bf" opacity=".15"/><polygon points="50,42 56,46 56,54 50,58 44,54 44,46" fill="#5eead4" opacity=".3"/></svg>`,

  "geo-diamond": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1e3a5f"/><stop offset="1" stop-color="#0c1929"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><rect x="29" y="29" width="42" height="42" rx="2" transform="rotate(45 50 50)" fill="none" stroke="#38bdf8" stroke-width="2" opacity=".6"/><rect x="37" y="37" width="26" height="26" rx="1" transform="rotate(45 50 50)" fill="#38bdf8" opacity=".2"/><rect x="44" y="44" width="12" height="12" transform="rotate(45 50 50)" fill="#7dd3fc" opacity=".35"/></svg>`,

  "geo-ripple": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#4c0519"/><stop offset="1" stop-color="#2d0310"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><circle cx="50" cy="50" r="35" fill="none" stroke="#fb7185" stroke-width="1.5" opacity=".5"/><circle cx="50" cy="50" r="26" fill="none" stroke="#fda4af" stroke-width="1.5" opacity=".4"/><circle cx="50" cy="50" r="17" fill="none" stroke="#fecdd3" stroke-width="1.5" opacity=".3"/><circle cx="50" cy="50" r="8" fill="#fb7185" opacity=".4"/></svg>`,

  "geo-burst": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#451a03"/><stop offset="1" stop-color="#271001"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><g stroke="#fbbf24" stroke-width="1.5" opacity=".5"><line x1="50" y1="50" x2="50" y2="12"/><line x1="50" y1="50" x2="77" y2="19"/><line x1="50" y1="50" x2="88" y2="50"/><line x1="50" y1="50" x2="77" y2="81"/><line x1="50" y1="50" x2="50" y2="88"/><line x1="50" y1="50" x2="23" y2="81"/><line x1="50" y1="50" x2="12" y2="50"/><line x1="50" y1="50" x2="23" y2="19"/></g><circle cx="50" cy="50" r="8" fill="#fbbf24" opacity=".35"/></svg>`,

  "geo-cube": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#0f172a"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><polygon points="50,22 78,38 50,54 22,38" fill="#64748b" opacity=".35"/><polygon points="50,54 78,38 78,62 50,78" fill="#475569" opacity=".3"/><polygon points="50,54 22,38 22,62 50,78" fill="#334155" opacity=".25"/><polygon points="50,22 78,38 78,62 50,78 22,62 22,38" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity=".4"/><line x1="50" y1="54" x2="50" y2="78" stroke="#94a3b8" stroke-width="1" opacity=".3"/></svg>`,

  "geo-grid": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#064e3b"/><stop offset="1" stop-color="#022c22"/></radialGradient><clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><g clip-path="url(#c)" stroke="#34d399" stroke-width="1.2" opacity=".3"><line x1="0" y1="0" x2="100" y2="100"/><line x1="25" y1="0" x2="125" y2="100"/><line x1="-25" y1="0" x2="75" y2="100"/><line x1="50" y1="0" x2="150" y2="100"/><line x1="-50" y1="0" x2="50" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="75" y1="0" x2="-25" y2="100"/><line x1="125" y1="0" x2="25" y2="100"/><line x1="50" y1="0" x2="-50" y2="100"/><line x1="150" y1="0" x2="50" y2="100"/></g></svg>`,

  "geo-bloom": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3b0764"/><stop offset="1" stop-color="#1a0333"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#b)"/><g opacity=".45"><ellipse cx="50" cy="50" rx="8" ry="24" fill="none" stroke="#d946ef" stroke-width="1.5"/><ellipse cx="50" cy="50" rx="8" ry="24" fill="none" stroke="#d946ef" stroke-width="1.5" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="8" ry="24" fill="none" stroke="#d946ef" stroke-width="1.5" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="6" fill="#e879f9" opacity=".3"/></svg>`,
}

// ============================================================================
// COMBINED REGISTRY
// ============================================================================

const ALL_SVGS: Record<string, string> = { ...GRADIENT_SVGS, ...GEOMETRIC_SVGS }

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Gradient Orbs
  { id: "gradient-violet", category: "gradient", label: "Violet Dusk" },
  { id: "gradient-coral", category: "gradient", label: "Coral Sunset" },
  { id: "gradient-teal", category: "gradient", label: "Ocean Teal" },
  { id: "gradient-rose", category: "gradient", label: "Rose Bloom" },
  { id: "gradient-emerald", category: "gradient", label: "Emerald Glow" },
  { id: "gradient-sky", category: "gradient", label: "Arctic Sky" },
  { id: "gradient-amber", category: "gradient", label: "Golden Amber" },
  { id: "gradient-lavender", category: "gradient", label: "Lavender Haze" },
  // Geometric Patterns
  { id: "geo-prism", category: "geometric", label: "Prism" },
  { id: "geo-hex", category: "geometric", label: "Hexagon" },
  { id: "geo-diamond", category: "geometric", label: "Diamond" },
  { id: "geo-ripple", category: "geometric", label: "Ripple" },
  { id: "geo-burst", category: "geometric", label: "Starburst" },
  { id: "geo-cube", category: "geometric", label: "Cube" },
  { id: "geo-grid", category: "geometric", label: "Lattice" },
  { id: "geo-bloom", category: "geometric", label: "Bloom" },
]

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get the raw SVG string for an avatar by ID.
 */
export function getAvatarSvg(id: string): string {
  return ALL_SVGS[id] || ALL_SVGS[DEFAULT_AVATAR_ID]
}

/**
 * Convert an avatar ID to a data URI suitable for <img src="...">.
 */
export function getAvatarDataUri(id: string): string {
  const svg = getAvatarSvg(id)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Find the avatar option by ID.
 */
export function getAvatarById(id: string): AvatarOption | undefined {
  return AVATAR_OPTIONS.find((a) => a.id === id)
}

/**
 * Get all avatars for a specific category.
 */
export function getAvatarsByCategory(category: "gradient" | "geometric"): AvatarOption[] {
  return AVATAR_OPTIONS.filter((a) => a.category === category)
}

/**
 * Check if a string is a valid avatar data URI from our registry.
 * Used to detect whether a user's current avatar_url is one of ours.
 */
export function isStaticAvatar(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith("data:image/svg+xml,")
}

/**
 * Try to find the avatar ID from a data URI. Returns undefined if not found.
 */
export function getAvatarIdFromDataUri(dataUri: string): string | undefined {
  for (const [id, svg] of Object.entries(ALL_SVGS)) {
    if (dataUri === `data:image/svg+xml,${encodeURIComponent(svg)}`) {
      return id
    }
  }
  return undefined
}

// ============================================================================
// SPECIAL AVATAR TYPES — Social login + Initials
// ============================================================================

/** Use the user's OAuth provider avatar (Google, GitHub, etc.) */
export const SOCIAL_AVATAR_ID = "social"

/** Use a generated avatar showing the user's initials */
export const INITIALS_AVATAR_ID = "initials"

const INITIALS_BG_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#f97316", "#eab308",
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function nameToColorIndex(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % INITIALS_BG_COLORS.length
}

/**
 * Generate a data URI for an initials-based avatar.
 * Background color is deterministically derived from the name.
 */
export function generateInitialsDataUri(name: string): string {
  const initials = getInitials(name || "U")
  const bg = INITIALS_BG_COLORS[nameToColorIndex(name || "User")]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${bg}"/><text x="50" y="50" font-family="system-ui,sans-serif" font-size="36" font-weight="600" fill="white" text-anchor="middle" dy=".35em">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Resolve an avatar ID to a displayable URL.
 * Handles static avatars, social avatars, and initials.
 */
export function resolveAvatarUrl(
  avatarId: string,
  options?: { socialAvatarUrl?: string | null; userName?: string }
): string {
  if (avatarId === SOCIAL_AVATAR_ID && options?.socialAvatarUrl) {
    return options.socialAvatarUrl
  }
  if (avatarId === INITIALS_AVATAR_ID) {
    return generateInitialsDataUri(options?.userName || "User")
  }
  return getAvatarDataUri(avatarId)
}

/**
 * Extract the OAuth/social avatar URL from a Supabase user's identity data.
 * Returns the first avatar URL found across all connected providers.
 */
export function extractSocialAvatarUrl(
  identities?: Array<{ identity_data?: Record<string, unknown> }> | null
): string | null {
  if (!identities?.length) return null
  for (const identity of identities) {
    const url =
      (identity.identity_data?.avatar_url as string) ||
      (identity.identity_data?.picture as string)
    if (url && url.startsWith("http")) return url
  }
  return null
}

