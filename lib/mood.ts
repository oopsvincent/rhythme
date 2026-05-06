export const MOOD_SCALE = [
  {
    value: 1,
    emoji: '😢',
    label: 'Drained',
    description: 'Everything feels heavier than usual.',
    accent: 'bg-rose-500',
    softAccent: 'bg-rose-500/10',
    text: 'text-rose-600',
    border: 'border-rose-500/30',
  },
  {
    value: 1.5,
    emoji: '😞',
    label: 'Low',
    description: 'You are getting through the day with limited bandwidth.',
    accent: 'bg-orange-500',
    softAccent: 'bg-orange-500/10',
    text: 'text-orange-600',
    border: 'border-orange-500/30',
  },
  {
    value: 2,
    emoji: '🙁',
    label: 'Heavy',
    description: 'A bit weighed down, tense, or mentally cluttered.',
    accent: 'bg-amber-500',
    softAccent: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/30',
  },
  {
    value: 2.5,
    emoji: '😐',
    label: 'Uneasy',
    description: 'Not at your best, but there is still some footing.',
    accent: 'bg-yellow-500',
    softAccent: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    border: 'border-yellow-500/30',
  },
  {
    value: 3,
    emoji: '🙂',
    label: 'Steady',
    description: 'A balanced middle ground.',
    accent: 'bg-lime-500',
    softAccent: 'bg-lime-500/10',
    text: 'text-lime-600',
    border: 'border-lime-500/30',
  },
  {
    value: 3.5,
    emoji: '😌',
    label: 'Grounded',
    description: 'Centered, calm, and reasonably present.',
    accent: 'bg-emerald-500',
    softAccent: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/30',
  },
  {
    value: 4,
    emoji: '😊',
    label: 'Bright',
    description: 'You have energy and emotional room to move.',
    accent: 'bg-sky-500',
    softAccent: 'bg-sky-500/10',
    text: 'text-sky-600',
    border: 'border-sky-500/30',
  },
  {
    value: 4.5,
    emoji: '😄',
    label: 'Lifted',
    description: 'Things feel light, capable, and encouraging.',
    accent: 'bg-blue-500',
    softAccent: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/30',
  },
  {
    value: 5,
    emoji: '🌟',
    label: 'Excellent',
    description: 'You feel strong, clear, and fully switched on.',
    accent: 'bg-violet-500',
    softAccent: 'bg-violet-500/10',
    text: 'text-violet-600',
    border: 'border-violet-500/30',
  },
] as const

export function formatMoodScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1)
}

export function getMoodOption(score: number | null | undefined) {
  if (score === null || score === undefined) return null
  return MOOD_SCALE.find((option) => option.value === score) ?? null
}

export function getMoodSummaryLabel(score: number | null | undefined) {
  return getMoodOption(score)?.label ?? 'No mood logged'
}
