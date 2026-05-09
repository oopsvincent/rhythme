export function playFocusSound() {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem('rhythme-focus-sound') === 'false') return
  
  try {
    const audio = new Audio('/sounds/bell.mp3')
    audio.volume = 0.6
    void audio.play()
  } catch (err) {
    console.error('Failed to play focus sound', err)
  }
}
