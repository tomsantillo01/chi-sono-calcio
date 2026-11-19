import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Game } from './components/Game'
import { Menu } from './components/Menu'
import { Tutorial } from './components/Tutorial'
import { useRoute } from './hooks/useRoute'
import type { Difficulty, Player } from './types'

function pickPlayer(level: Difficulty): Player {
  const pool = window.PLAYERS.filter(player => player.d <= level)
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function App() {
  const { route, navigate } = useRoute()
  const [level, setLevel] = useState<Difficulty>(1)
  const [points, setPoints] = useState(() => Number(localStorage.getItem('who-is-points')) || 0)
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('who-is-streak')) || 0)
  const [player, setPlayer] = useState<Player | null>(null)
  const [round, setRound] = useState(0)
  useEffect(() => localStorage.setItem('who-is-points', String(points)), [points])
  useEffect(() => localStorage.setItem('who-is-streak', String(streak)), [streak])
  useEffect(() => { if (route === '/play' && !player) setPlayer(pickPlayer(level)) }, [route, player, level])
  const startGame = () => { setPlayer(pickPlayer(level)); setRound(value => value + 1); navigate('/play') }
  return <main className="app-shell"><AnimatePresence mode="wait">
    {route === '/' && <Menu key="menu" {...{ level, setLevel, points, streak, startGame }} openTutorial={() => navigate('/tutorial')}/>} 
    {route === '/tutorial' && <Tutorial key="tutorial" back={() => navigate('/')}/>} 
    {route === '/play' && player && <Game key={`game-${round}`} {...{ player, level, points, streak, setPoints, setStreak, startGame }} quit={() => navigate('/')}/>} 
  </AnimatePresence></main>
}
