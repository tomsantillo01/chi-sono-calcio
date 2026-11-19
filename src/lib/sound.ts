export type SoundName = 'click' | 'success' | 'whistle'

const sources: Record<SoundName, string> = {
  click: '/sounds/ui-click.mp3',
  success: '/sounds/success.mp3',
  whistle: '/sounds/whistle.mp3',
}

export function playSound(name: SoundName, volume = .35) {
  const audio = new Audio(sources[name])
  audio.volume = volume
  void audio.play().catch(() => undefined)
}
