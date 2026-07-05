import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  RiBrainLine,
  RiBarChart2Line,
  RiCodeSSlashLine,
  RiDatabase2Line,
  RiToolsLine,
  RiTerminalBoxLine
} from 'react-icons/ri'
import { getSkills } from '../../utils/api'
import { STATIC_SKILLS } from '../../utils/staticData'

const getCategoryIcon = (category) => {
  const name = category.toLowerCase()
  if (name.includes('ml') || name.includes('ai') || name.includes('machine') || name.includes('intelligence') || name.includes('neural')) {
    return <RiBrainLine className="text-accent text-xl" />
  }
  if (name.includes('data') || name.includes('science') || name.includes('analysis') || name.includes('analytics') || name.includes('stat') || name.includes('graph')) {
    return <RiBarChart2Line className="text-accent text-xl" />
  }
  if (name.includes('web') || name.includes('dev') || name.includes('front') || name.includes('back') || name.includes('full') || name.includes('stack')) {
    return <RiCodeSSlashLine className="text-accent text-xl" />
  }
  if (name.includes('db') || name.includes('database') || name.includes('sql') || name.includes('nosql') || name.includes('storage') || name.includes('query')) {
    return <RiDatabase2Line className="text-accent text-xl" />
  }
  if (name.includes('tool') || name.includes('devops') || name.includes('git') || name.includes('docker') || name.includes('cloud') || name.includes('infra') || name.includes('system') || name.includes('os')) {
    return <RiToolsLine className="text-accent text-xl" />
  }
  return <RiTerminalBoxLine className="text-accent text-xl" />
}

export default function Skills() {
  const [skills, setSkills] = useState(STATIC_SKILLS)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    getSkills()
      .then((r) => r.data && setSkills(r.data))
      .catch(() => {})
  }, [])

  return (
    <section className="section-wrapper min-h-screen">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-tag mb-4">Tech Stack</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
            Skills &{' '}
            <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-slate font-body text-lg max-w-xl">
            Tools and technologies I use to bring intelligent systems to life.
          </p>
        </motion.div>

        {/* Grid layout for categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, data], catIdx) => {
            const currentSkills = Array.isArray(data) ? data : data.skills || []
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: catIdx * 0.1 }}
                className="group relative card p-6 bg-white/50 backdrop-blur-md border border-border/80 hover:border-accent-mid hover:shadow-xl hover:shadow-accent-light/30 transition-all duration-300 rounded-2xl overflow-hidden"
              >
                {/* Background ambient glow */}
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-300" />
                
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center border border-accent-mid/30 text-accent group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="font-display font-bold text-lg text-ink group-hover:text-accent transition-colors duration-200">
                      {category}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate bg-muted/60 border border-border px-2.5 py-1 rounded-full">
                    {currentSkills.length} Tools
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {currentSkills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: catIdx * 0.1 + i * 0.03 }}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className="px-3.5 py-1.5 text-sm font-body font-medium text-slate bg-white/60 hover:bg-accent hover:text-white border border-border/60 hover:border-accent shadow-sm rounded-xl transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
