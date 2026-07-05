import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiUser3Line, RiCodeSSlashLine, RiBriefcaseLine,
  RiFileTextLine, RiBuildingLine, RiMailLine, RiMenuLine, RiCloseLine,
  RiTrophyLine
} from 'react-icons/ri'

const NAV_ITEMS = [
  { label: 'About', href: '/about', icon: RiUser3Line },
  { label: 'Skills', href: '/skills', icon: RiCodeSSlashLine },
  { label: 'Projects', href: '/projects', icon: RiBriefcaseLine },
  { label: 'Resume', href: '/resume', icon: RiFileTextLine },
  { label: 'Experience', href: '/experience', icon: RiBuildingLine },
  { label: 'Hackathons', href: '/hackathons', icon: RiTrophyLine },
  { label: 'Contact', href: '/contact', icon: RiMailLine },
]

export default function SideNav() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location])

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-border rounded-xl p-2.5 shadow-sm hover:border-accent transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border z-50 lg:hidden shadow-xl"
          >
            <div className="p-6 pt-16">
              <p className="text-xs font-mono text-slate uppercase tracking-widest mb-6">Navigation</p>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-accent-light text-accent'
                          : 'text-slate hover:bg-muted hover:text-ink'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop vertical side nav */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[72px] flex-col items-center justify-center z-30 border-r border-border bg-white/70 backdrop-blur-md"
      >
        {/* Logo mark */}
        <Link to="/" className="absolute top-6">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">YK</span>
          </div>
        </Link>

        {/* Nav items */}
        <nav className="flex flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                title={item.label}
                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-accent text-white shadow-md shadow-blue-200'
                    : 'text-slate hover:bg-accent-light hover:text-accent'
                }`}
              >
                <Icon size={18} />
                {/* Tooltip */}
                <span className="absolute left-14 px-2.5 py-1 bg-ink text-white text-xs font-body rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-lg">
                  {item.label}
                </span>
                {/* Active dot */}
                {active && (
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-l-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </motion.aside>
    </>
  )
}
