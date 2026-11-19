export type CareerStop = [years: string, club: string, appearances: number | null, goals: number | null, loan?: number]

export type Player = {
  n: string
  a: string[]
  d: 1 | 2 | 3
  r: string
  c: CareerStop[]
}

declare global {
  interface Window { PLAYERS: Player[] }
}

export type Difficulty = 1 | 2 | 3
export const levels: Record<Difficulty, string> = { 1: 'Facile', 2: 'Medio', 3: 'Difficile' }
