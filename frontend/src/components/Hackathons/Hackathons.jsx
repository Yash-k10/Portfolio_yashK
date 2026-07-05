import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  RiTrophyLine, RiCalendarLine, RiMapPinLine, RiTeamLine,
  RiExternalLinkLine, RiAwardLine, RiGithubLine
} from 'react-icons/ri'
import { getHackathons } from '../../utils/api'

const DEFAULT_HACKATHONS = [
  {
    _id: 'h1',
    title: 'Smart India Hackathon',
    organizer: 'Government of India',
    date: 'Sep 2024',
    location: 'Nagpur, MH',
    role: 'Team Lead',
    result: 'Finalist',
    description: 'Built an AI-powered crop disease detection system using computer vision, helping farmers identify plant diseases in real-time through a mobile app.',
    tech: ['Python', 'TensorFlow', 'React Native', 'Flask'],
    certificateUrl: '',
    projectUrl: '',
  },
  {
    _id: 'h2',
    title: 'HackVerse 2024',
    organizer: 'Tech Community',
    date: 'Mar 2024',
    location: 'Online',
    role: 'ML Engineer',
    result: 'Winner — Best AI Solution',
    description: 'Developed a real-time fraud detection model for financial transactions using ensemble learning, achieving 96% precision under time constraints.',
    tech: ['Python', 'XGBoost', 'FastAPI', 'Docker'],
    certificateUrl: '',
    projectUrl: '',
  },
]

const RESULT_STYLES = {
  winner: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  finalist: 'bg-blue-50 text-blue-700 border-blue-300',
  default: 'bg-green-50 text-green-700 border-green-300',
}

function getResultStyle(result = '') {
  const lower = result.toLowerCase()
  if (lower.includes('winner') || lower.includes('1st')) return RESULT_STYLES.winner
  if (lower.includes('finalist')) return RESULT_STYLES.finalist
  return RESULT_STYLES.default
}

function HackathonCard({ hack, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="card p-6 hover:border-accent-mid group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-300">
          <RiTrophyLine size={20} className="text-accent group-hover:text-white transition-colors duration-300" />
        </div>
        {hack.result && (
          <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border shrink-0 ${getResultStyle(hack.result)}`}>
            {hack.result}
          </span>
        )}
      </div>

      {/* Title + organizer */}
      <h3 className="font-display font-semibold text-lg text-ink mb-1 group-hover:text-accent transition-colors duration-200">
        {hack.title}
      </h3>
      {hack.organizer && (
        <p className="text-accent font-body font-medium text-sm mb-3">{hack.organizer}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate font-mono">
        {hack.date && (
          <span className="flex items-center gap-1.5"><RiCalendarLine size={12} /> {hack.date}</span>
        )}
        {hack.location && (
          <span className="flex items-center gap-1.5"><RiMapPinLine size={12} /> {hack.location}</span>
        )}
        {hack.role && (
          <span className="flex items-center gap-1.5"><RiTeamLine size={12} /> {hack.role}</span>
        )}
      </div>

      {/* Description */}
      {hack.description && (
        <p className="text-slate font-body text-sm leading-relaxed mb-4">{hack.description}</p>
      )}

      {/* Tech */}
      {hack.tech?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hack.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 bg-muted text-slate text-xs font-mono rounded-md">{t}</span>
          ))}
        </div>
      )}

      {/* Links */}
      {(hack.certificateUrl || hack.projectUrl) && (
        <div className="flex gap-3 pt-3 border-t border-border">
          {hack.projectUrl && (
            <a
              href={hack.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate hover:text-accent text-sm font-body font-medium transition-colors"
            >
              <RiGithubLine size={14} /> Project
            </a>
          )}
          {hack.certificateUrl && (
            <a
              href={hack.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate hover:text-accent text-sm font-body font-medium transition-colors"
            >
              <RiAwardLine size={14} /> Certificate <RiExternalLinkLine size={11} />
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function Hackathons() {
  const [hackathons, setHackathons] = useState(DEFAULT_HACKATHONS)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getHackathons()
      .then((r) => r.data?.length && setHackathons(r.data))
      .catch(() => {})
  }, [])

  if (hackathons.length === 0) return null

  return (
    <section className="section-wrapper min-h-screen" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="section-tag mb-4">Hackathons</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
          Competitions &{' '}
          <span className="gradient-text">Achievements</span>
        </h2>
        <p className="text-slate font-body text-lg max-w-xl">
          Building under pressure — hackathons where I've turned ideas into working prototypes in 24-48 hours.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        {hackathons.map((hack, i) => (
          <HackathonCard key={hack._id} hack={hack} index={i} />
        ))}
      </div>
    </section>
  )
}
