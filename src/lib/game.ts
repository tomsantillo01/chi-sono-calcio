import type { Player } from '../types'

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]++
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]
}

export function matchesPlayer(player: Player, guess: string) {
  const answer = normalize(guess)
  if (answer.length < 3) return false
  const name = normalize(player.n)
  const options = new Set([name, name.split(' ').at(-1)!, ...player.a.map(normalize)])
  return [...options].some(option => answer === option || distance(answer, option) <= (option.length > 7 ? 2 : option.length > 4 ? 1 : 0))
}
