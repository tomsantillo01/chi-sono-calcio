import { motion } from 'framer-motion'
import { ArrowRight, CircleHelp, Play, Sparkles, Trophy, Users } from 'lucide-react'
import { MotionButton } from './MotionButton'
import { levels, type Difficulty } from '../types'

type Props = { level: Difficulty; setLevel: (level: Difficulty) => void; points: number; streak: number; startGame: () => void; openTutorial: () => void }
export function Menu({ level, setLevel, points, streak, startGame, openTutorial }: Props) {
  return <motion.section className="menu-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
    <header className="topbar"><span className="brand"><i/>WHO IS?</span><span className="season">SERIE A EDITION <b>26</b></span></header>
    <div className="menu-hero"><motion.div className="hero-orb" animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 26 }}/><p className="eyebrow"><Sparkles size={14}/> IL QUIZ DEL CALCIO</p><h1>La carriera<br/><em>non mente.</em></h1><p className="intro">Segui le tracce, club dopo club.<br/>Riconosci il campione prima del fischio finale.</p></div>
    <div className="menu-actions"><div className="level-picker"><span>DIFFICOLTÀ</span>{Object.entries(levels).map(([id, label]) => <button key={id} className={level === Number(id) ? 'active' : ''} onClick={() => setLevel(Number(id) as Difficulty)}>{label}</button>)}</div><MotionButton className="play-button" onClick={startGame}><Play fill="currentColor" size={18}/> Gioca <ArrowRight size={19}/></MotionButton><button className="menu-link" disabled><Users size={19}/> Multiplayer <span>PRESTO</span></button><button className="menu-link" onClick={openTutorial}><CircleHelp size={19}/> Come si gioca <ArrowRight size={17}/></button></div>
    <footer className="menu-footer"><span><Trophy size={15}/> {points.toLocaleString('it-IT')} PT</span><span>STRISCIA <b>{streak}</b></span></footer>
  </motion.section>
}
