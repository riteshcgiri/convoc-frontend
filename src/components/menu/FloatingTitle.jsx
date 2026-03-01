import { motion, AnimatePresence } from 'framer-motion'

const FloatingTitle = ({ title, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.h2 initial={{ opacity: 0, x: -8, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -6, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2  backdrop-blur-md text-nowrap bg-gradient-to-r from-primary/30  to-secondary/20 px-4 text-xs py-2 rounded-full  pointer-events-none z-[9999] whitespace-nowrap">
          {title}
        </motion.h2>
      )}
    </AnimatePresence>
  )
}

export default FloatingTitle