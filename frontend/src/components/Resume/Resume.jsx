import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RiDownloadLine, RiBrainLine, RiDatabase2Line, RiCodeSSlashLine, RiExternalLinkLine } from 'react-icons/ri'
import { getResume, getCertificates, getEducation } from '../../utils/api'

const RESUME_CATEGORIES = [
  {
    icon: RiBrainLine,
    title: 'Machine Learning',
    color: 'from-blue-500 to-blue-400',
    items: [
      'Supervised & Unsupervised Learning',
      'Deep Neural Networks (CNN, RNN, LSTM)',
      'Natural Language Processing',
      'Computer Vision with OpenCV',
      'Model Deployment & MLOps',
      'RAG & LLM Fine-tuning',
    ],
  },
  {
    icon: RiDatabase2Line,
    title: 'Data Science',
    color: 'from-purple-500 to-purple-400',
    items: [
      'Exploratory Data Analysis (EDA)',
      'Feature Engineering & Selection',
      'Statistical Modeling & Hypothesis Testing',
      'Time Series Forecasting',
      'Data Visualization (Plotly, Seaborn)',
      'Big Data Processing with Pandas',
    ],
  },
  {
    icon: RiCodeSSlashLine,
    title: 'Full Stack Dev',
    color: 'from-green-500 to-green-400',
    items: [
      'React.js + Tailwind CSS',
      'Node.js + Express REST APIs',
      'MongoDB + MySQL Databases',
      'Docker & Cloud Deployment',
      'Git Version Control',
      'API Integration & Testing',
    ],
  },
]

const DEFAULT_EDUCATION = [
  {
    _id: 'default-1',
    degree: 'Bachelor of Technology — Computer Science',
    institution: 'RTM Nagpur University, Nagpur',
    duration: '2021 – 2025',
    grade: 'CGPA: 8.4 / 10',
    description: 'Relevant: Machine Learning, Data Structures, Algorithms, DBMS, Computer Networks, Statistics',
  },
]

const DEFAULT_CERTS = [
  { _id: 'c1', name: 'Machine Learning Specialization', org: 'DeepLearning.AI / Coursera', year: '2024', url: '' },
  { _id: 'c2', name: 'TensorFlow Developer Certificate', org: 'Google', year: '2024', url: '' },
  { _id: 'c3', name: 'Natural Language Processing', org: 'Hugging Face', year: '2023', url: '' },
  { _id: 'c4', name: 'Data Science Professional', org: 'IBM / Coursera', year: '2023', url: '' },
]

export default function Resume() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [resumeDoc, setResumeDoc] = useState(null)
  const [certificates, setCertificates] = useState(DEFAULT_CERTS)
  const [education, setEducation] = useState(DEFAULT_EDUCATION)

  useEffect(() => {
    getResume().then(r => r.data && setResumeDoc(r.data)).catch(() => {})
    getCertificates().then(r => r.data?.length && setCertificates(r.data)).catch(() => {})
    getEducation().then(r => r.data?.length && setEducation(r.data)).catch(() => {})
  }, [])

  const resumeUrl = resumeDoc?.url || '/resume.pdf'

  return (
    <section className="section-wrapper min-h-screen" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="section-tag mb-4">Resume</span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
              My <span className="gradient-text">Qualifications</span>
            </h2>
            <p className="text-slate font-body text-lg max-w-xl">
              A snapshot of my technical expertise across ML, Data Science, and Full Stack development.
            </p>
          </div>
          <a
            href={resumeUrl}
            download="Yash_Kapse_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-primary shrink-0"
          >
            <RiDownloadLine size={16} /> Download Resume
          </a>
        </div>
      </motion.div>

      {/* Skill categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {RESUME_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="card overflow-hidden"
            >
              <div className={`p-5 bg-gradient-to-r ${cat.color} flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg">{cat.title}</h3>
              </div>
              <div className="p-5 space-y-2.5">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-slate font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card p-8 mb-6"
      >
        <h3 className="font-display font-semibold text-xl text-ink mb-6">Education</h3>
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu._id} className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h4 className="font-display font-semibold text-lg text-ink">{edu.degree}</h4>
                <p className="text-accent font-body font-medium text-sm mb-1">{edu.institution}</p>
                <p className="text-slate font-body text-sm">
                  {edu.duration}
                  {edu.grade && <span>&nbsp;·&nbsp;{edu.grade}</span>}
                </p>
                {edu.description && (
                  <p className="text-slate font-body text-sm mt-2">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="card p-8"
      >
        <h3 className="font-display font-semibold text-xl text-ink mb-6">Certifications</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {certificates.map((cert) => {
            const content = (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-xl hover:bg-accent-light hover:border-accent-mid border border-transparent transition-all duration-200 group">
                <span className="text-lg mt-0.5">🏅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-ink group-hover:text-accent transition-colors">
                    {cert.name}
                  </p>
                  <p className="text-slate font-body text-xs">{cert.org} · {cert.year}</p>
                </div>
                {cert.url && (
                  <RiExternalLinkLine size={14} className="text-slate group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                )}
              </div>
            )

            return cert.url ? (
              <a key={cert._id} href={cert.url} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              <div key={cert._id}>{content}</div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
