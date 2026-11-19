import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { matchesPlayer } from '../lib/game'
import { playSound } from '../lib/sound'
import { levels, type CareerStop, type Difficulty, type Player } from '../types'
import { MotionButton } from './MotionButton'

const SEGMENT_SECONDS = 9
const FINAL_SECONDS = 20
type Props = { player: Player; level: Difficulty; points: number; streak: number; setPoints: React.Dispatch<React.SetStateAction<number>>; setStreak: React.Dispatch<React.SetStateAction<number>>; startGame: () => void; quit: () => void }

export function Game({ player, level, points, streak, setPoints, setStreak, startGame, quit }: Props) {
  const [revealed, setRevealed] = useState(1)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [message, setMessage] = useState('')
  const [seconds, setSeconds] = useState(SEGMENT_SECONDS)
  const input = useRef<HTMLInputElement>(null)
  const isFinalRound = revealed === player.c.length
  const active = player.c[revealed - 1]

  useEffect(() => input.current?.focus(), [])
  useEffect(() => {
    const history = document.querySelector<HTMLElement>('.history-scroll')
    history?.scrollTo({ left: history.scrollWidth, behavior: 'smooth' })
  }, [revealed])
  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => setSeconds(value => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [status, isFinalRound, revealed])
  useEffect(() => {
    if (seconds < 0) isFinalRound ? giveUp() : revealNext(true)
  }, [seconds, isFinalRound])

  const revealNext = (automatic = false) => {
    if (isFinalRound) return
    playSound(automatic ? 'whistle' : 'click')
    setRevealed(value => value + 1)
    setSeconds(revealed + 1 === player.c.length ? FINAL_SECONDS : SEGMENT_SECONDS)
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!guess.trim() || status !== 'playing') return
    if (matchesPlayer(player, guess)) {
      const won = Math.max(100, 700 - (revealed - 1) * 75)
      playSound('success', .5); setPoints(total => total + won); setStreak(total => total + 1); setStatus('won'); setMessage(`+${won} PUNTI`)
    } else { playSound('whistle', .22); setMessage('Non è lui. Riprova.'); setGuess(''); input.current?.focus() }
  }
  const giveUp = () => { playSound('whistle'); setStatus('lost'); setStreak(0); setMessage('La partita è finita.') }

  return <motion.section className="game-view" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
    <header className="game-header"><button className="brand plain" onClick={quit}><X size={17}/> ESCI</button><div className="scoreboard"><span>PT <b>{points}</b></span><span>🔥 <b>{streak}</b></span></div></header>
    <div className="game-title"><p>CHI È QUESTO GIOCATORE?</p><h2>{status === 'playing' ? 'La sua storia.' : player.n}</h2><span>{levels[level]} · {revealed}/{player.c.length} TAPPE</span></div>
    {isFinalRound ? <FinalRound player={player} seconds={seconds}/> : <ActiveStop stop={active} seconds={seconds}/>} 
    <CareerTimeline stops={isFinalRound ? player.c : player.c.slice(0, revealed - 1)} final={isFinalRound} progress={Math.round(revealed / player.c.length * 100)}/>
    {!isFinalRound && status === 'playing' && <MotionButton className="reveal-button" onClick={() => revealNext()}>Scopri ora <ArrowRight size={18}/></MotionButton>}
    <AnimatePresence>{status !== 'playing' && <Result message={message} player={player} startGame={startGame} won={status === 'won'}/>}</AnimatePresence>
    {status === 'playing' && <GuessDock {...{ input, guess, setGuess, submit, giveUp, message }}/>} 
  </motion.section>
}

function ActiveStop({ stop, seconds }: { stop: CareerStop; seconds: number }) {
  return <div className="active-card"><div className="active-label">TAPPA ATTUALE <b>{seconds}s</b></div><div className="timer-line"><motion.i animate={{ width: `${Math.max(0, seconds) / SEGMENT_SECONDS * 100}%` }} transition={{ ease: 'linear', duration: .5 }}/></div><AnimatePresence mode="wait"><motion.div key={`${stop[0]}-${stop[1]}`} className="active-stop" initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .32 }}><p>{stop[0]}</p><h3>{stop[1]}</h3><span>{stop[2] ?? '—'} presenze <i/> {stop[3] ?? '—'} gol</span></motion.div></AnimatePresence>{stop[4] && <small className="loan-badge">IN PRESTITO</small>}</div>
}

function FinalRound({ player, seconds }: { player: Player; seconds: number }) {
  const appearances = player.c.reduce((total, stop) => total + (stop[2] || 0), 0)
  return <motion.div className="final-round" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><p>PERCORSO COMPLETO · <b>{Math.max(0, seconds)}s</b></p><h3>Chi è?</h3><span>{player.c.length} club · {appearances.toLocaleString('it-IT')} presenze</span></motion.div>
}

function CareerTimeline({ stops, final, progress }: { stops: CareerStop[]; final: boolean; progress: number }) {
  return <><div className="history-title"><span>{final ? 'CARRIERA COMPLETA' : 'PERCORSO SBLOCCATO'}</span><b>{progress}%</b></div><div className="history-scroll"><div className="history-line">{stops.map(([years, club], index) => <div className="history-item" key={`${years}-${club}-${index}`}><i/><span>{years}</span><b>{club}</b></div>)}{!final && <div className="history-now"><i/><span>ORA</span></div>}</div></div></>
}

function GuessDock({ input, guess, setGuess, submit, giveUp, message }: { input: React.RefObject<HTMLInputElement | null>; guess: string; setGuess: (value: string) => void; submit: (event: FormEvent) => void; giveUp: () => void; message: string }) {
  return <div className="guess-dock"><div className="guess-inner"><button className="give-up" onClick={giveUp}>Arrenditi</button><form onSubmit={submit}><input ref={input} value={guess} onChange={event => setGuess(event.target.value)} placeholder="Nome del giocatore..." aria-label="Nome del giocatore"/><MotionButton type="submit" aria-label="Invia risposta"><ArrowRight size={21}/></MotionButton></form></div>{message && <p className="guess-message">{message}</p>}</div>
}

function Result({ message, player, startGame, won }: { message: string; player: Player; startGame: () => void; won: boolean }) {
  return <motion.div className="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><p>{message}</p><h3>{player.n}</h3><MotionButton className="play-button" onClick={startGame}>{won ? 'Prossimo giocatore' : 'Riprova'} <ArrowRight size={18}/></MotionButton></motion.div>
}
