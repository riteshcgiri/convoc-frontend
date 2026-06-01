import { useState } from 'react'
import { motion } from 'framer-motion'
import FloatingTitle from './FloatingTitle'
import { Link, useLocation } from 'react-router-dom'

const MenuOption = ({ menu, pClass, isMobileBar = false }) => {
  const [hoveredTitle, setHoveredTitle] = useState(null)
  const location = useLocation()



  // MOBILE
  if (isMobileBar) {
    return (
      <div className="flex items-center justify-around w-full px-3">
        {menu.map((m) => {
          const isActive = (() => {
            if (!m?.to) return false
            if (m.to === '/chat') { return location.pathname === '/chat' }
            return ( location.pathname === m.to || location.pathname.startsWith(m.to + '/') )}
          )()

          return (
            <div key={m.title} className="flex-1 flex justify-center">
              <Link
                to={m?.to || '#'}
                onClick={m?.fnc}
                className="relative flex items-center justify-center"
              >
                {/* Floating pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute w-14 h-2 -translate-x-1/2 left-1/2 -top-5.5 rounded-xl bg-primary "
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    y: isActive ? -8 : 0,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={`z-10 ${isActive ? 'text-primary' : 'text-zinc-400'
                    }`}
                >
                  {m?.src ? (
                    <img
                      src={m.src}
                      className={`w-7 h-7 rounded-full ${isActive ? 'ring-2 ring-primary' : ''
                        }`}
                    />
                  ) : (
                    m.icon
                  )}
                </motion.div>
              </Link>
            </div>
          )
        })}
      </div>
    )
  }
  // DESKTOP
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={`w-full flex flex-col items-center gap-3 py-4 text-primary ${pClass}`}
    >
      {menu.map((m) => {
        const isActive = m?.to && location.pathname === m.to

        return m?.to ? (
          <motion.div key={m.title}>
            <Link
              to={m.to}
              onClick={m?.fnc}
              className={`
                relative flex items-center justify-center transition-all cursor-pointer group
                ${m?.src ? 'rounded-full' : `p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'hover:bg-primary/20'}`}
              `}
              onMouseEnter={() => setHoveredTitle(m.title)}
              onMouseLeave={() => setHoveredTitle(null)}
            >
              {m?.src ? (
                <motion.img
                  src={m.src}
                  alt="profile"
                  className={`w-10 h-10 object-cover rounded-full ${isActive ? 'ring-2 ring-primary' : ''}`}
                  whileHover={{ scale: 1.1 }}
                />
              ) : (
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  className="flex items-center justify-center"
                >
                  {m.icon}
                </motion.span>
              )}
              <FloatingTitle title={m.title} visible={hoveredTitle === m.title} />
            </Link>
          </motion.div>
        ) : (
          // Items with only fnc and no to (e.g. Logout)
          <motion.div key={m.title}>
            <button
              onClick={m?.fnc}
              className="relative flex items-center justify-center p-2 rounded-lg hover:bg-primary/20 transition-all cursor-pointer group"
              onMouseEnter={() => setHoveredTitle(m.title)}
              onMouseLeave={() => setHoveredTitle(null)}
            >
              <motion.span whileHover={{ scale: 1.2 }} className="flex items-center justify-center">
                {m.icon}
              </motion.span>
              <FloatingTitle title={m.title} visible={hoveredTitle === m.title} />
            </button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MenuOption