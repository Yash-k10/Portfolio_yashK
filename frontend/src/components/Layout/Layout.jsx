import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import SideNav from './SideNav'
import AnimatedBackground from './AnimatedBackground'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
}

export default function Layout({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <SideNav />

      <main className="relative z-10 lg:pl-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
