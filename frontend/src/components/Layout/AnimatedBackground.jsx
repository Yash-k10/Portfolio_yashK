import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Large soft blob top-right */}
      <motion.div
        className="blob w-[600px] h-[600px] bg-blue-100 opacity-40"
        style={{ top: '-10%', right: '-10%' }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Medium blob bottom-left */}
      <motion.div
        className="blob w-[400px] h-[400px] bg-indigo-100 opacity-35"
        style={{ bottom: '5%', left: '-8%' }}
        animate={{
          x: [0, -20, 25, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.95, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Small accent blob center */}
      <motion.div
        className="blob w-[250px] h-[250px] bg-sky-100 opacity-50"
        style={{ top: '40%', left: '50%' }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #2563EB 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Very subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent" />
    </div>
  )
}
