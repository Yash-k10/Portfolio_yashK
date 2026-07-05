import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiArrowLeftLine, RiGithubLine, RiExternalLinkLine,
  RiLightbulbLine, RiFlowChart, RiBarChartLine
} from 'react-icons/ri'
import { getProject } from '../../utils/api'
import { STATIC_PROJECTS } from '../../utils/staticData'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProject(id)
      .then((r) => setProject(r.data))
      .catch(() => {
        const found = STATIC_PROJECTS.find((p) => p._id === id)
        setProject(found || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="section-wrapper flex items-center justify-center min-h-screen">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-accent rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="section-wrapper flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="font-display text-3xl font-bold text-ink mb-4">Project not found</h2>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    )
  }

  const sections = [
    { icon: RiLightbulbLine, title: 'The Problem', content: project.problem },
    { icon: RiFlowChart, title: 'Approach & Architecture', content: project.approach },
    { icon: RiBarChartLine, title: 'Results & Impact', content: project.results },
  ]

  return (
    <section className="section-wrapper min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-slate hover:text-accent font-body text-sm font-medium mb-8 transition-colors"
        >
          <RiArrowLeftLine size={16} /> Back to Projects
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="section-tag">{project.category}</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-slate font-body text-lg leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 shrink-0">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="btn-ghost">
                <RiGithubLine size={16} /> GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary">
                <RiExternalLinkLine size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Tech stack */}
        <div className="card p-6 mb-10">
          <p className="text-xs font-mono text-slate uppercase tracking-widest mb-4">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="px-3 py-1.5 bg-accent-light text-accent border border-accent-mid text-sm font-mono rounded-lg">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Project image */}
        {project.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 rounded-2xl overflow-hidden border border-border shadow-lg"
          >
            <img src={project.image} alt={project.title} className="w-full object-cover" />
          </motion.div>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((sec, i) => {
            const Icon = sec.icon
            if (!sec.content) return null
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-ink">{sec.title}</h3>
                </div>
                <p className="text-slate font-body text-base leading-relaxed">{sec.content}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation between projects */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t border-border">
          <Link to="/projects" className="btn-ghost">
            <RiArrowLeftLine size={16} /> All Projects
          </Link>
          <Link to="/contact" className="btn-primary">
            Discuss This Project
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
