import { motion, type ComponentProps } from 'framer-motion'

export function MotionButton({ children, ...props }: ComponentProps<typeof motion.button>) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: .97 }} {...props}>{children}</motion.button>
}
