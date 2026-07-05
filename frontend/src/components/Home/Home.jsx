import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import {
  RiArrowRightLine, RiDownloadLine, RiMailLine,
  RiGithubLine, RiLinkedinLine, RiCodeSSlashLine
} from 'react-icons/ri'
import { getAbout } from '../../utils/api'
import profileImg from '../../assets/profile.jpg'

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
}
const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export default function Home() {
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    getAbout()
      .then((r) => r.data?.avatar && setAvatar(r.data.avatar))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top-right CTAs */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="fixed top-0 right-0 z-40 p-4 flex items-center gap-3"
      >
        <a
          href="/resume.pdf"
          download
          className="btn-ghost text-xs px-4 py-2"
        >
          <RiDownloadLine size={14} /> Resume
        </a>
        <Link to="/contact" className="btn-primary text-xs px-4 py-2">
          <RiMailLine size={14} /> Contact
        </Link>
      </motion.header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-3xl w-full"
        >
          {/* Status badge */}
          <motion.div variants={item} className="mb-8">
            <span className="section-tag">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Open to opportunities
            </span>
          </motion.div>

          {/* Profile row */}
          <motion.div variants={item} className="flex items-center gap-6 mb-8">
            {/* Avatar with revolving dotted animation */}
            <div className="relative shrink-0 w-[3.4cm] h-[3.4cm] flex items-center justify-center">
              {/* Revolving dotted ring */}
              <motion.svg
                className="absolute inset-0 w-full h-full text-accent"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </motion.svg>

              {/* Profile image circle (Radius 1.5cm / Diameter 3cm) */}
              <div className="w-[3cm] h-[3cm] rounded-full overflow-hidden border-2 border-white shadow-md relative z-10 bg-slate-100">
                <img
                  src={avatar || profileImg}
                  alt="Yash Kapse"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20" />
            </div>

            <div>
              <p className="text-slate text-sm font-body font-medium mb-1">Hey there 👋 I'm</p>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-none">
                Yash Kapse
              </h1>
            </div>
          </motion.div>

          {/* Role */}
          <motion.div variants={item} className="mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border max-w-[40px]" />
              <span className="text-accent font-mono text-sm font-medium">
                <TypeAnimation
                  sequence={[
                    'Machine Learning Engineer',
                    2000,
                    'Data Science Practitioner',
                    2000,
                    'AI Systems Builder',
                    2000,
                    'Deep Learning Enthusiast',
                    2000,
                  ]}
                  repeat={Infinity}
                  speed={60}
                />
              </span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.h2 variants={item} className="font-display font-semibold text-3xl sm:text-4xl text-ink mb-6 leading-tight">
            Data-Driven Decisions,{' '}
            <span className="gradient-text">AI-Powered Solutions</span>
          </motion.h2>

          {/* Intro */}
          <motion.p variants={item} className="text-slate font-body text-lg leading-relaxed mb-10 max-w-xl">
            I engineer intelligent systems — from fine-tuned language models to production ML pipelines —
            that solve real problems at scale. Turning messy data into meaningful decisions is my craft.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-12">
            <Link to="/projects" className="btn-primary">
              View Projects <RiArrowRightLine size={16} />
            </Link>
            <Link to="/about" className="btn-ghost">
              About Me
            </Link>
          </motion.div>

          {/* Social + stats */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-6">
            {/* Social */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/yashkapse"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-slate hover:border-accent hover:text-accent hover:bg-accent-light transition-all duration-200"
                aria-label="GitHub"
              >
                <RiGithubLine size={17} />
              </a>
              <a
                href="https://linkedin.com/in/yashkapse"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-slate hover:border-accent hover:text-accent hover:bg-accent-light transition-all duration-200"
                aria-label="LinkedIn"
              >
                <RiLinkedinLine size={17} />
              </a>
              <a
                href="mailto:yash.kapse@email.com"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-slate hover:border-accent hover:text-accent hover:bg-accent-light transition-all duration-200"
                aria-label="Email"
              >
                <RiMailLine size={17} />
              </a>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-border" />

            {/* Stats */}
            {[
              { val: '4+', label: 'ML Projects' },
              { val: '2+', label: 'Internships' },
              { val: '94%', label: 'Best Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-xl text-accent">{stat.val}</p>
                <p className="text-slate text-xs font-body">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center pb-8"
      >
        <div className="flex flex-col items-center gap-1 text-slate">
          <span className="text-xs font-mono">scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-border to-transparent"
          />
        </div>
      </motion.div>
    </div>
  )
}
