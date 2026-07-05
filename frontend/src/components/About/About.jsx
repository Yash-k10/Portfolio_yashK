import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RiBrainLine, RiCodeSSlashLine, RiDatabase2Line } from 'react-icons/ri'
import { getAbout } from '../../utils/api'
import { ABOUT_TEXT } from '../../utils/staticData'

const highlights = [
  { icon: RiBrainLine, label: 'ML Engineer', desc: 'End-to-end model design & deployment' },
  { icon: RiDatabase2Line, label: 'Data Scientist', desc: 'EDA, feature engineering & insights' },
  { icon: RiCodeSSlashLine, label: 'Full Stack', desc: 'React + Node + cloud deployment' },
]

export default function About() {
  const [about, setAbout] = useState(ABOUT_TEXT)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    getAbout()
      .then((r) => r.data?.text && setAbout(r.data.text))
      .catch(() => {})
  }, [])

  return (
    <section className="section-wrapper min-h-screen flex items-center">
      <div className="w-full" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag mb-4">About Me</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-12 leading-tight">
            Building the future,<br />
            <span className="gradient-text">one model at a time</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {about.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate font-body text-base leading-relaxed mb-5 last:mb-0">
                {para}
              </p>
            ))}

            {/* Quick facts */}
            <div className="mt-8 p-5 bg-white rounded-2xl border border-border">
              <p className="text-xs font-mono text-slate uppercase tracking-widest mb-4">Quick Facts</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Location', val: 'Nagpur, Maharashtra 🇮🇳' },
                  { label: 'Education', val: 'B.Tech Computer Science' },
                  { label: 'Focus', val: 'ML, NLP, Computer Vision' },
                  { label: 'Status', val: 'Open to Full-time / Internship' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate font-body">{f.label}</span>
                    <span className="text-ink font-medium font-body">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4"
          >
            {highlights.map((h, i) => {
              const Icon = h.icon
              return (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="card p-6 flex items-start gap-4 group hover:border-accent-mid"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Icon size={22} className="text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-ink text-lg mb-1">{h.label}</h3>
                    <p className="text-slate font-body text-sm">{h.desc}</p>
                  </div>
                </motion.div>
              )
            })}

            {/* Avatar card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="card p-6 flex items-center gap-4 bg-gradient-to-br from-accent to-blue-400"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white font-display font-bold text-xl">YK</span>
              </div>
              <div>
                <p className="text-white font-display font-semibold text-lg">Yash Kapse</p>
                <p className="text-blue-100 font-body text-sm">Machine Learning Engineer</p>
                <p className="text-blue-200 font-mono text-xs mt-1">yash.kapse@email.com</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
