import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RiGithubLine, RiExternalLinkLine, RiArrowRightLine } from 'react-icons/ri'
import { getProjects } from '../../utils/api'
import { STATIC_PROJECTS } from '../../utils/staticData'

const CATEGORY_COLORS = {
  'AI/ML': 'bg-blue-50 text-blue-600 border-blue-200',
  'Data Science': 'bg-purple-50 text-purple-600 border-purple-200',
  NLP: 'bg-green-50 text-green-600 border-green-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
}

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="card p-6 flex flex-col group hover:border-accent-mid"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS.default}`}>
          {project.category}
        </span>
        <div className="flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="GitHub"
            >
              <RiGithubLine size={15} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Live Demo"
            >
              <RiExternalLinkLine size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-xl text-ink mb-3 group-hover:text-accent transition-colors duration-200">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-slate font-body text-sm leading-relaxed mb-5 flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.slice(0, 5).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-muted text-slate text-xs font-mono rounded-md">
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="px-2 py-0.5 bg-muted text-slate text-xs font-mono rounded-md">
            +{project.tech.length - 5}
          </span>
        )}
      </div>

      {/* View details */}
      <Link
        to={`/projects/${project._id}`}
        className="inline-flex items-center gap-1.5 text-accent font-body font-medium text-sm hover:gap-2.5 transition-all duration-200"
      >
        View Details <RiArrowRightLine size={15} />
      </Link>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState(STATIC_PROJECTS)
  const [filter, setFilter] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getProjects()
      .then((r) => r.data?.length && setProjects(r.data))
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="section-wrapper min-h-screen">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="section-tag mb-4">Portfolio</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate font-body text-lg max-w-xl mb-8">
            Real-world ML and AI solutions built from data to deployment.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-body font-medium border transition-all duration-200 ${
                  filter === cat
                    ? 'bg-accent text-white border-accent shadow-md shadow-blue-200'
                    : 'bg-white text-slate border-border hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
