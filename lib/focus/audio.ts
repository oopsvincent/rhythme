export function playFocusSound() {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem('rhythme-focus-sound') === 'false') return

  try {
    const audio = new Audio('/sounds/bell.mp3')
    audio.volume = 0.6

    const playPromise = audio.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      void playPromise.catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          return
        }

        console.error('Failed to play focus sound', error)
      })
    }
  } catch (error) {
    console.error('Failed to play focus sound', error)
  }
}
