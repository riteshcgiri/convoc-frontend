import { useState } from 'react'
import { motion } from 'framer-motion'
import FloatingTitle from './FloatingTitle'
import { Link } from 'react-router-dom'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 350, damping: 26 } }
}

const MenuOption = ({ menu, pClass }) => {
  const [hoveredTitle, setHoveredTitle] = useState(null)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`w-full flex justify-center flex-col gap-2 py-5 text-primary ${pClass}`}>
      {menu.map(m => (
        <motion.div key={m.title} variants={itemVariants}>
          <Link to={m?.to} className={`relative justify-center flex items-center transition-all cursor-pointer group ${m?.src ? 'rounded-full' : 'hover:bg-primary/20 py-3'}`} onMouseEnter={() => setHoveredTitle(m.title)} onMouseLeave={() => setHoveredTitle(null)}>
            
            {m?.src ? (
              <motion.img src={m.src} key={m.src} alt="profile" className="w-12 h-12 object-cover rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}/>
            ) : (
              <motion.span className="flex items-center justify-center" whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 6px currentColor)' }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                {m?.icon}
              </motion.span>
            )}

            <FloatingTitle title={m.title} visible={hoveredTitle === m.title} />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default MenuOption