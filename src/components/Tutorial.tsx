import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MotionButton } from './MotionButton'

export function Tutorial({ back }: { back: () => void }) {
  return <motion.section className="tutorial-view panel" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }}><button className="back" onClick={back}><ArrowLeft size={19}/> Menu</button><p className="eyebrow">COME SI GIOCA</p><h2>Una carriera.<br/>Un solo nome.</h2><div className="steps"><p><b>01</b> Osserva il primo club della carriera.</p><p><b>02</b> Sblocca le tappe successive, una alla volta.</p><p><b>03</b> Inserisci il nome quando sei pronto: prima indovini, più punti fai.</p></div><MotionButton className="play-button" onClick={back}>Ho capito <ArrowRight size={19}/></MotionButton></motion.section>
}
