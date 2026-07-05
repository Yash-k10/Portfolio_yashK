import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RiBuildingLine, RiCalendarLine, RiMapPinLine } from 'react-icons/ri'
import { getExperience } from '../../utils/api'
import { STATIC_EXPERIENCE } from '../../utils/staticData'

function ExperienceCard({ exp, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="hidden sm:flex absolute left-6 top-16 bottom-0 w-px bg-border" />

      <div className="card p-6 sm:ml-16 relative group hover:border-accent-mid">
        {/* Timeline dot */}
        <div className="hidden sm:flex absolute -left-10 top-6 w-5 h-5 rounded-full bg-white border-2 border-accent items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-accent" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-300">
              <RiBuildingLine size={20} className="text-accent group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-ink">{exp.role}</h3>
              <p className="text-accent font-body font-medium text-sm">{exp.company}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right shrink-0">
            <div className="flex items-center gap-1.5 text-slate text-xs font-body justify-end">
              <RiCalendarLine size={12} />
              {exp.duration}
            </div>
            <div className="flex items-center gap-1.5 text-slate text-xs font-body justify-end">
              <RiMapPinLine size={12} />
              {exp.location}
            </div>
          </div>
        </div>

        {/* Bullet points */}
        <ul className="space-y-2 mb-4">
          {exp.description.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate font-body leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {exp.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 bg-muted text-slate text-xs font-mono rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const [experiences, setExperiences] = useState(STATIC_EXPERIENCE)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getExperience()
      .then((r) => r.data?.length && setExperiences(r.data))
      .catch(() => {})
  }, [])

  return (
    <section className="section-wrapper min-h-screen" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="section-tag mb-4">Experience</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
          Professional{' '}
          <span className="gradient-text">Journey</span>
        </h2>
        <p className="text-slate font-body text-lg max-w-xl">
          Internships and roles where I've applied ML and data science to solve real business problems.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative space-y-6 sm:pl-10">
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp._id} exp={exp} index={i} />
        ))}

        {/* Future placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="relative sm:ml-16"
        >
          <div className="hidden sm:flex absolute -left-10 top-6 w-5 h-5 rounded-full bg-white border-2 border-dashed border-accent items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent/40" />
          </div>
          <div className="card p-6 border-dashed border-2 border-border text-center">
            <p className="text-slate font-body text-sm">
              🚀 <strong className="text-ink">Next opportunity</strong> — Open to ML Engineer / Data Science roles
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
