import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  RiDashboardLine, RiBriefcaseLine, RiCodeSSlashLine,
  RiUser3Line, RiFileTextLine, RiBuildingLine,
  RiLogoutBoxLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiImageLine, RiExternalLinkLine, RiCloseLine,
  RiMailLine, RiAwardLine, RiDownloadLine, RiUploadLine,
  RiEyeLine, RiSaveLine, RiTrophyLine,
  RiBrainLine, RiBarChart2Line, RiDatabase2Line, RiToolsLine, RiTerminalBoxLine
} from 'react-icons/ri'
import {
  getProjects, createProject, updateProject, deleteProject,
  getSkills, updateSkills, getAbout, updateAbout, uploadAvatar,
  getExperience, createExperience, updateExperience, deleteExperience,
  getEducation, createEducation, updateEducation, deleteEducation,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getHackathons, createHackathon, updateHackathon, deleteHackathon,
  getContactInfo, updateContactInfo,
  getResume, uploadResume, deleteResume,
  uploadImage
} from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { STATIC_PROJECTS, STATIC_SKILLS, ABOUT_TEXT, STATIC_EXPERIENCE } from '../../utils/staticData'

const TABS = [
  { id: 'overview',     label: 'Overview',      icon: RiDashboardLine },
  { id: 'projects',     label: 'Projects',       icon: RiBriefcaseLine },
  { id: 'skills',       label: 'Skills',         icon: RiCodeSSlashLine },
  { id: 'about',        label: 'About',          icon: RiUser3Line },
  { id: 'experience',   label: 'Experience',     icon: RiBuildingLine },
  { id: 'hackathons',   label: 'Hackathons',     icon: RiTrophyLine },
  { id: 'qualifications', label: 'Qualifications', icon: RiAwardLine },
  { id: 'contact',      label: 'Contact Info',   icon: RiMailLine },
  { id: 'resume',       label: 'Resume',         icon: RiFileTextLine },
]

// ─── Reusable Confirm Modal ───────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-display font-semibold text-lg text-ink mb-2">Confirm Delete</h3>
        <p className="text-slate font-body text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-body font-medium text-sm hover:bg-red-600 transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

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

// ─── Skill Category Editor ────────────────────────────────────────────────────
function SkillCategoryEditor({ category, data, onChange }) {
  const [inputVal, setInputVal] = useState('')
  const currentSkills = Array.isArray(data) ? data : Array.isArray(data?.skills) ? data.skills : []

  const addSkill = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    if (currentSkills.includes(trimmed)) { toast.error(`"${trimmed}" already exists`); setInputVal(''); return }
    const updated = typeof data === 'object' && !Array.isArray(data)
      ? { ...data, skills: [...currentSkills, trimmed] }
      : [...currentSkills, trimmed]
    onChange(updated); setInputVal('')
  }

  const removeSkill = (skill) => {
    const updated = typeof data === 'object' && !Array.isArray(data)
      ? { ...data, skills: currentSkills.filter(s => s !== skill) }
      : currentSkills.filter(s => s !== skill)
    onChange(updated)
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        {getCategoryIcon(category)}
        <h3 className="font-display font-semibold text-ink">{category}</h3>
        <span className="ml-auto text-xs font-mono text-slate bg-muted px-2 py-0.5 rounded-full">{currentSkills.length} skills</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 min-h-[44px] p-3 bg-muted rounded-xl border border-border">
        {currentSkills.length === 0 && <p className="text-slate text-sm italic self-center">No skills yet</p>}
        {currentSkills.map(skill => (
          <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-accent-mid text-accent text-sm rounded-lg shadow-sm">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 transition-all text-slate">
              <RiCloseLine size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addSkill())}
          placeholder="Type skill and press Enter to add..." className="input-field flex-1" />
        <button type="button" onClick={addSkill} disabled={!inputVal.trim()} className="btn-primary px-4 disabled:opacity-40">
          <RiAddLine size={16} /> Add
        </button>
      </div>
      <p className="text-xs font-mono text-slate mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-white border border-border rounded text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-border rounded text-xs">,</kbd> to add · Click × to remove
      </p>
    </div>
  )
}

// ─── Project Form Modal ───────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', description: '', tech: '', category: 'AI/ML', github: '', live: '', problem: '', approach: '', results: '', image: '' })
  const [techInput, setTechInput] = useState(Array.isArray(initial?.tech) ? initial.tech.join(', ') : (initial?.tech || ''))
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleImage = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    setUploading(true)
    try { const { data } = await uploadImage(fd); setForm(f => ({ ...f, image: data.url })); toast.success('Image uploaded') }
    catch { toast.error('Image upload failed') } finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await onSave({ ...form, tech: techInput.split(',').map(t => t.trim()).filter(Boolean) }) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full my-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-ink">{initial ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Title *</label>
              <input name="title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" required /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input-field">
                {['AI/ML','Data Science','NLP','Computer Vision','Full Stack'].map(c => <option key={c}>{c}</option>)}
              </select></div>
          </div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} className="input-field resize-none" required /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Tech Stack (comma-separated)</label>
            <input value={techInput} onChange={e => setTechInput(e.target.value)} className="input-field" placeholder="Python, TensorFlow, React" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">GitHub URL</label>
              <input name="github" value={form.github} onChange={e => setForm(f => ({...f, github: e.target.value}))} className="input-field" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Live URL</label>
              <input name="live" value={form.live} onChange={e => setForm(f => ({...f, live: e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Problem</label>
            <textarea name="problem" value={form.problem} onChange={e => setForm(f => ({...f, problem: e.target.value}))} rows={2} className="input-field resize-none" /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Approach</label>
            <textarea name="approach" value={form.approach} onChange={e => setForm(f => ({...f, approach: e.target.value}))} rows={3} className="input-field resize-none" /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Results</label>
            <textarea name="results" value={form.results} onChange={e => setForm(f => ({...f, results: e.target.value}))} rows={2} className="input-field resize-none" /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Image</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="imgUpload" />
              <label htmlFor="imgUpload" className="btn-ghost text-xs cursor-pointer"><RiImageLine size={14} />{uploading ? 'Uploading...' : 'Upload Image'}</label>
              {form.image && <span className="text-xs text-green-600 font-mono">✓ Image attached</span>}
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initial ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Experience Form Modal ────────────────────────────────────────────────────
function ExperienceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    role: initial?.role || '',
    company: initial?.company || '',
    duration: initial?.duration || '',
    location: initial?.location || 'Remote',
    description: Array.isArray(initial?.description) ? initial.description.join('\n') : (initial?.description || ''),
    tech: Array.isArray(initial?.tech) ? initial.tech.join(', ') : (initial?.tech || ''),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await onSave({
        ...form,
        description: form.description.split('\n').map(s => s.trim()).filter(Boolean),
        tech: form.tech.split(',').map(s => s.trim()).filter(Boolean),
      })
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-xl w-full my-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-ink">{initial ? 'Edit Experience' : 'Add Experience'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Position / Role *</label>
              <input value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} className="input-field" required placeholder="ML Engineer Intern" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Company *</label>
              <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="input-field" required placeholder="Company Name" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Duration *</label>
              <input value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} className="input-field" required placeholder="Jun 2024 – Aug 2024" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="input-field" placeholder="Remote / City, State" /></div>
          </div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Description (one point per line)</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={5} className="input-field resize-none" placeholder={"Built X model achieving Y accuracy.\nAutomated pipeline processing Z records."} /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Skills Used (comma-separated)</label>
            <input value={form.tech} onChange={e => setForm(f => ({...f, tech: e.target.value}))} className="input-field" placeholder="Python, TensorFlow, Pandas" /></div>
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initial ? 'Update' : 'Add Experience')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Education Form Modal ─────────────────────────────────────────────────────
function EducationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    degree: initial?.degree || '',
    institution: initial?.institution || '',
    duration: initial?.duration || '',
    grade: initial?.grade || '',
    description: initial?.description || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await onSave(form) } finally { setSaving(false) } }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-xl w-full my-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-ink">{initial ? 'Edit Education' : 'Add Education'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Degree / Course *</label>
            <input value={form.degree} onChange={e => setForm(f => ({...f, degree: e.target.value}))} className="input-field" required placeholder="B.Tech Computer Science" /></div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Institution *</label>
            <input value={form.institution} onChange={e => setForm(f => ({...f, institution: e.target.value}))} className="input-field" required placeholder="University Name" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Duration *</label>
              <input value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} className="input-field" required placeholder="2021 – 2025" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Grade / CGPA</label>
              <input value={form.grade} onChange={e => setForm(f => ({...f, grade: e.target.value}))} className="input-field" placeholder="CGPA: 8.4 / 10" /></div>
          </div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="input-field resize-none" placeholder="Relevant coursework, achievements..." /></div>
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initial ? 'Update' : 'Add Education')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Certificate Form Modal ───────────────────────────────────────────────────
function CertificateForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    org: initial?.org || '',
    year: initial?.year || '',
    url: initial?.url || '',
  })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('org', form.org)
      fd.append('year', form.year)
      fd.append('url', form.url)
      if (file) fd.append('file', file)
      await onSave(fd)
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-xl w-full my-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-ink">{initial ? 'Edit Certificate' : 'Add Certificate'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Certificate Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input-field" required placeholder="Machine Learning Specialization" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Issuing Organization *</label>
              <input value={form.org} onChange={e => setForm(f => ({...f, org: e.target.value}))} className="input-field" required placeholder="Coursera / Google" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Year *</label>
              <input value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} className="input-field" required placeholder="2024" /></div>
          </div>
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Certificate URL (optional)</label>
            <input value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))} className="input-field" placeholder="https://coursera.org/verify/..." /></div>
          <div>
            <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Upload Certificate File (PDF/Image)</label>
            <div className="flex items-center gap-3">
              <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} className="hidden" id="certFile" />
              <label htmlFor="certFile" className="btn-ghost text-xs cursor-pointer">
                <RiUploadLine size={14} /> {file ? file.name : 'Choose File (PDF/Image)'}
              </label>
              {(initial?.url || file) && <span className="text-xs text-green-600 font-mono">✓ File ready</span>}
            </div>
            <p className="text-xs text-slate font-mono mt-1">Upload a file OR paste a URL above — file takes priority</p>
          </div>
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initial ? 'Update' : 'Add Certificate')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Hackathon Form Modal ─────────────────────────────────────────────────────
function HackathonForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    organizer: initial?.organizer || '',
    date: initial?.date || '',
    location: initial?.location || '',
    role: initial?.role || '',
    result: initial?.result || '',
    description: initial?.description || '',
    certificateUrl: initial?.certificateUrl || '',
    projectUrl: initial?.projectUrl || '',
  })
  const [techInput, setTechInput] = useState(Array.isArray(initial?.tech) ? initial.tech.join(', ') : (initial?.tech || ''))
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, val]) => fd.append(key, val))
      fd.append('tech', techInput)
      if (imageFile) fd.append('image', imageFile)
      await onSave(fd)
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full my-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-ink">{initial ? 'Edit Hackathon' : 'Add Hackathon'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Hackathon Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" required placeholder="Smart India Hackathon" /></div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Organizer</label>
              <input value={form.organizer} onChange={e => setForm(f => ({...f, organizer: e.target.value}))} className="input-field" placeholder="Government of India" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Date *</label>
              <input value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="input-field" required placeholder="Sep 2024" /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="input-field" placeholder="Nagpur, MH / Online" /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Your Role</label>
              <input value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} className="input-field" placeholder="Team Lead / Participant" /></div>
          </div>

          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Result / Achievement</label>
            <input value={form.result} onChange={e => setForm(f => ({...f, result: e.target.value}))} className="input-field" placeholder="Winner, Finalist, Top 10..." /></div>

          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="input-field resize-none" placeholder="What did you build? What problem did it solve?" /></div>

          <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Tech Stack (comma-separated)</label>
            <input value={techInput} onChange={e => setTechInput(e.target.value)} className="input-field" placeholder="Python, TensorFlow, React" /></div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Project URL</label>
              <input value={form.projectUrl} onChange={e => setForm(f => ({...f, projectUrl: e.target.value}))} className="input-field" placeholder="https://github.com/..." /></div>
            <div><label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Certificate URL</label>
              <input value={form.certificateUrl} onChange={e => setForm(f => ({...f, certificateUrl: e.target.value}))} className="input-field" placeholder="https://..." /></div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-1.5">Cover Image (optional)</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="hackImage" />
              <label htmlFor="hackImage" className="btn-ghost text-xs cursor-pointer"><RiImageLine size={14} /> {imageFile ? imageFile.name : 'Upload Image'}</label>
              {(initial?.image || imageFile) && <span className="text-xs text-green-600 font-mono">✓ Image set</span>}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initial ? 'Update' : 'Add Hackathon')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState(STATIC_SKILLS)
  const [about, setAbout] = useState(ABOUT_TEXT)
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [certificates, setCertificates] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', linkedin: '', github: '', portfolio: '', address: '' })
  const [resumeDoc, setResumeDoc] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingContact, setSavingContact] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadAll = async () => {
    setLoading(true)
    try {
      const results = await Promise.allSettled([
        getProjects(), getSkills(), getAbout(), getExperience(),
        getEducation(), getCertificates(), getContactInfo(), getResume(),
        getHackathons()
      ])
      const [p, s, a, e, ed, c, ci, r, h] = results
      if (p.status === 'fulfilled' && p.value.data?.length) setProjects(p.value.data)
      else setProjects(STATIC_PROJECTS)
      if (s.status === 'fulfilled' && s.value.data) setSkills(s.value.data)
      if (a.status === 'fulfilled' && a.value.data) {
        if (a.value.data.text) setAbout(a.value.data.text)
        if (a.value.data.avatar) setAvatar(a.value.data.avatar)
      }
      if (e.status === 'fulfilled' && e.value.data?.length) setExperience(e.value.data)
      else setExperience(STATIC_EXPERIENCE)
      if (ed.status === 'fulfilled' && ed.value.data) setEducation(ed.value.data)
      if (c.status === 'fulfilled' && c.value.data) setCertificates(c.value.data)
      if (ci.status === 'fulfilled' && ci.value.data) setContactInfo(ci.value.data)
      if (r.status === 'fulfilled' && r.value.data) setResumeDoc(r.value.data)
      if (h.status === 'fulfilled' && h.value.data) setHackathons(h.value.data)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [])

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('avatar', avatarFile)
      const { data } = await uploadAvatar(fd)
      if (data?.avatar) {
        setAvatar(data.avatar)
        setAvatarFile(null)
        toast.success('Profile picture updated!')
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Upload failed'
      toast.error(msg)
    } finally {
      setUploadingAvatar(false)
    }
  }

  // ── Project CRUD
  const saveProject = async (data) => {
    try {
      if (modal?.data?._id) { await updateProject(modal.data._id, data); toast.success('Project updated ✓') }
      else { await createProject(data); toast.success('Project created ✓') }
      setModal(null); loadAll()
    } catch { toast.error('Failed to save project') }
  }

  // ── Experience CRUD
  const saveExperience = async (data) => {
    try {
      if (modal?.data?._id) { await updateExperience(modal.data._id, data); toast.success('Experience updated ✓') }
      else { await createExperience(data); toast.success('Experience added ✓') }
      setModal(null); loadAll()
    } catch { toast.error('Failed to save experience') }
  }

  // ── Education CRUD
  const saveEducation = async (data) => {
    try {
      if (modal?.data?._id) { await updateEducation(modal.data._id, data); toast.success('Education updated ✓') }
      else { await createEducation(data); toast.success('Education added ✓') }
      setModal(null); loadAll()
    } catch { toast.error('Failed to save education') }
  }

  // ── Certificate CRUD
  const saveCertificate = async (formData) => {
    try {
      if (modal?.data?._id) { await updateCertificate(modal.data._id, formData); toast.success('Certificate updated ✓') }
      else { await createCertificate(formData); toast.success('Certificate added ✓') }
      setModal(null); loadAll()
    } catch { toast.error('Failed to save certificate') }
  }

  // ── Hackathon CRUD
  const saveHackathon = async (formData) => {
    try {
      if (modal?.data?._id) { await updateHackathon(modal.data._id, formData); toast.success('Hackathon updated ✓') }
      else { await createHackathon(formData); toast.success('Hackathon added ✓') }
      setModal(null); loadAll()
    } catch { toast.error('Failed to save hackathon') }
  }

  // ── Contact Info save
  const saveContactInfo = async () => {
    setSavingContact(true)
    try { await updateContactInfo(contactInfo); toast.success('Contact info updated ✓') }
    catch { toast.error('Failed to save') } finally { setSavingContact(false) }
  }

  // ── Resume upload
  const handleResumeUpload = async () => {
    if (!resumeFile) { toast.error('Please select a PDF file first'); return }
    setUploadingResume(true)
    try {
      const fd = new FormData(); fd.append('resume', resumeFile)
      const { data } = await uploadResume(fd)
      setResumeDoc(data); setResumeFile(null); toast.success('Resume uploaded ✓')
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Upload failed'
      console.error('Resume upload error:', err.response?.data || err.message)
      toast.error(msg)
    } finally { setUploadingResume(false) }
  }

  // ── Generic delete helper
  const confirmDelete = (message, onConfirm) => setConfirm({ message, onConfirm })

  return (
    <div className="min-h-screen bg-muted flex">
      {/* ── Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">YK</span>
            </div>
            <div>
              <p className="font-display font-semibold text-ink text-sm">Yash Kapse</p>
              <p className="text-slate font-mono text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${tab === t.id ? 'bg-accent-light text-accent' : 'text-slate hover:bg-muted hover:text-ink'}`}>
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-slate hover:bg-accent-light hover:text-accent transition-all">
            <RiExternalLinkLine size={16} /> View Portfolio
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-slate hover:bg-red-50 hover:text-red-500 transition-all">
            <RiLogoutBoxLine size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h1 className="font-display font-bold text-2xl text-ink mb-8">Dashboard Overview</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              {[
                { label: 'Projects', val: projects.length, icon: '🚀', color: 'bg-blue-50 border-blue-200' },
                { label: 'Skill Categories', val: Object.keys(skills).length, icon: '🛠️', color: 'bg-purple-50 border-purple-200' },
                { label: 'Experience', val: experience.length, icon: '💼', color: 'bg-green-50 border-green-200' },
                { label: 'Hackathons', val: hackathons.length, icon: '🏆', color: 'bg-orange-50 border-orange-200' },
                { label: 'Certificates', val: certificates.length, icon: '🏅', color: 'bg-yellow-50 border-yellow-200' },
              ].map(stat => (
                <div key={stat.label} className={`card p-5 border ${stat.color}`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <p className="font-display font-bold text-3xl text-ink">{stat.val}</p>
                  <p className="text-slate font-body text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-display font-semibold text-lg text-ink mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { setTab('projects'); setModal({ type: 'project' }) }} className="btn-primary text-sm"><RiAddLine size={15} /> Add Project</button>
                <button onClick={() => { setTab('experience'); setModal({ type: 'experience' }) }} className="btn-ghost text-sm"><RiAddLine size={15} /> Add Experience</button>
                <button onClick={() => { setTab('hackathons'); setModal({ type: 'hackathon' }) }} className="btn-ghost text-sm"><RiAddLine size={15} /> Add Hackathon</button>
                <button onClick={() => { setTab('qualifications'); setModal({ type: 'certificate' }) }} className="btn-ghost text-sm"><RiAddLine size={15} /> Add Certificate</button>
                <button onClick={() => setTab('contact')} className="btn-ghost text-sm"><RiEditLine size={15} /> Edit Contact</button>
                <button onClick={() => setTab('resume')} className="btn-ghost text-sm"><RiUploadLine size={15} /> Upload Resume</button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">Projects <span className="text-slate font-body text-lg font-normal">({projects.length})</span></h2>
              <button onClick={() => setModal({ type: 'project' })} className="btn-primary"><RiAddLine size={16} /> New Project</button>
            </div>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p._id} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-ink truncate">{p.title}</h3>
                      <span className="text-xs font-mono text-slate bg-muted px-2 py-0.5 rounded-full shrink-0">{p.category}</span>
                    </div>
                    <p className="text-slate text-sm truncate mb-2">{p.description}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(p.tech || []).slice(0, 5).map(t => <span key={t} className="text-xs font-mono bg-accent-light text-accent px-2 py-0.5 rounded border border-accent-mid">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setModal({ type: 'project', data: p })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all"><RiEditLine size={14} /></button>
                    <button onClick={() => confirmDelete('Delete this project?', async () => { try { await deleteProject(p._id); toast.success('Deleted'); loadAll() } catch { toast.error('Failed') } setConfirm(null) })}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"><RiDeleteBinLine size={14} /></button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <div className="text-center py-16 text-slate"><p className="text-4xl mb-3">🚀</p><p className="font-semibold text-ink">No projects yet</p></div>}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {tab === 'skills' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-ink">Skills</h2>
                <p className="text-slate text-sm mt-1">Press Enter or comma to add · Click × to remove</p>
              </div>
              <button onClick={async () => { try { await updateSkills(skills); toast.success('Skills saved ✓') } catch { toast.error('Failed') } }} className="btn-primary">
                <RiSaveLine size={16} /> Save All
              </button>
            </div>
            <div className="space-y-5">
              {Object.entries(skills).map(([cat, data]) => (
                <SkillCategoryEditor key={cat} category={cat} data={data} onChange={newData => setSkills({ ...skills, [cat]: newData })} />
              ))}
            </div>
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm">💡 Click <strong>Save All</strong> after making changes.</p>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {tab === 'about' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-ink">About & Photo</h2>
                <p className="text-slate text-sm mt-1">Manage your introduction text and landing page photo</p>
              </div>
              <button onClick={async () => { try { await updateAbout({ text: about }); toast.success('Saved ✓') } catch { toast.error('Failed') } }} className="btn-primary">
                <RiSaveLine size={16} /> Save Text
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Text Area */}
              <div className="md:col-span-2 card p-6">
                <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-3">About Introduction Text</label>
                <textarea value={about} onChange={e => setAbout(e.target.value)} rows={14} className="input-field resize-y w-full text-sm leading-relaxed" />
                <p className="text-slate font-mono text-xs mt-2">{about.length} characters</p>
              </div>

              {/* Photo Manager */}
              <div className="card p-6 flex flex-col items-center">
                <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-4 self-start">Landing Page Photo</label>
                
                {/* Photo Preview */}
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-border shadow-md mb-6 bg-slate-100 flex items-center justify-center">
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : avatar ? (
                    <img src={avatar} alt="Current profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent to-blue-300 flex items-center justify-center">
                      <span className="text-white font-display font-bold text-3xl">YK</span>
                    </div>
                  )}
                </div>

                {/* Upload Action */}
                <div className="w-full space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={e => setAvatarFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="btn-ghost w-full justify-center text-sm cursor-pointer"
                    >
                      <RiImageLine size={16} /> Select New Photo
                    </label>
                  </div>

                  {avatarFile && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="btn-primary w-full justify-center text-sm"
                    >
                      {uploadingAvatar ? 'Uploading...' : 'Upload & Change Photo'}
                    </button>
                  )}

                  {avatarFile && (
                    <button
                      onClick={() => setAvatarFile(null)}
                      className="btn-ghost w-full justify-center text-sm text-red-500 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {tab === 'experience' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">Experience <span className="text-slate font-body text-lg font-normal">({experience.length})</span></h2>
              <button onClick={() => setModal({ type: 'experience' })} className="btn-primary"><RiAddLine size={16} /> Add Experience</button>
            </div>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-ink text-lg">{exp.role}</h3>
                      <p className="text-accent font-body font-medium text-sm">{exp.company}</p>
                      <p className="text-slate font-mono text-xs mt-0.5">{exp.duration} · {exp.location}</p>
                      <ul className="mt-3 space-y-1">
                        {exp.description?.map((d, i) => (
                          <li key={i} className="text-slate text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />{d}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {exp.tech?.map(t => <span key={t} className="text-xs font-mono bg-muted text-slate px-2 py-0.5 rounded">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModal({ type: 'experience', data: exp })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all"><RiEditLine size={14} /></button>
                      <button onClick={() => confirmDelete('Delete this experience entry?', async () => { try { await deleteExperience(exp._id); toast.success('Deleted'); loadAll() } catch { toast.error('Failed') } setConfirm(null) })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"><RiDeleteBinLine size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {experience.length === 0 && <div className="text-center py-16 text-slate"><p className="text-4xl mb-3">💼</p><p className="font-semibold text-ink">No experience entries</p></div>}
            </div>
          </div>
        )}

        {/* HACKATHONS */}
        {tab === 'hackathons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">Hackathons <span className="text-slate font-body text-lg font-normal">({hackathons.length})</span></h2>
              <button onClick={() => setModal({ type: 'hackathon' })} className="btn-primary"><RiAddLine size={16} /> Add Hackathon</button>
            </div>
            <div className="space-y-4">
              {hackathons.map(hack => (
                <div key={hack._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-ink text-lg">{hack.title}</h3>
                        {hack.result && (
                          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-300">
                            {hack.result}
                          </span>
                        )}
                      </div>
                      {hack.organizer && <p className="text-accent font-body font-medium text-sm">{hack.organizer}</p>}
                      <p className="text-slate font-mono text-xs mt-0.5">
                        {hack.date}{hack.location && ` · ${hack.location}`}{hack.role && ` · ${hack.role}`}
                      </p>
                      {hack.description && <p className="text-slate text-sm mt-2">{hack.description}</p>}
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {hack.tech?.map(t => <span key={t} className="text-xs font-mono bg-muted text-slate px-2 py-0.5 rounded">{t}</span>)}
                      </div>
                      <div className="flex gap-4 mt-3">
                        {hack.projectUrl && (
                          <a href={hack.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-accent font-mono flex items-center gap-1 hover:underline">
                            <RiExternalLinkLine size={11} /> Project
                          </a>
                        )}
                        {hack.certificateUrl && (
                          <a href={hack.certificateUrl} target="_blank" rel="noreferrer" className="text-xs text-accent font-mono flex items-center gap-1 hover:underline">
                            <RiExternalLinkLine size={11} /> Certificate
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModal({ type: 'hackathon', data: hack })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all"><RiEditLine size={14} /></button>
                      <button onClick={() => confirmDelete('Delete this hackathon entry?', async () => { try { await deleteHackathon(hack._id); toast.success('Deleted'); loadAll() } catch { toast.error('Failed') } setConfirm(null) })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"><RiDeleteBinLine size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {hackathons.length === 0 && <div className="text-center py-16 text-slate"><p className="text-4xl mb-3">🏆</p><p className="font-semibold text-ink">No hackathons added yet</p></div>}
            </div>
          </div>
        )}

        {/* QUALIFICATIONS (Education + Certificates) */}
        {tab === 'qualifications' && (
          <div>
            <h2 className="font-display font-bold text-2xl text-ink mb-8">Qualifications</h2>

            {/* Education */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-ink">Education</h3>
                <button onClick={() => setModal({ type: 'education' })} className="btn-primary text-sm"><RiAddLine size={15} /> Add Education</button>
              </div>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu._id} className="card p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0"><span className="text-lg">🎓</span></div>
                      <div>
                        <h4 className="font-display font-semibold text-ink">{edu.degree}</h4>
                        <p className="text-accent text-sm font-medium">{edu.institution}</p>
                        <p className="text-slate font-mono text-xs">{edu.duration}{edu.grade && ` · ${edu.grade}`}</p>
                        {edu.description && <p className="text-slate text-sm mt-1">{edu.description}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModal({ type: 'education', data: edu })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all"><RiEditLine size={14} /></button>
                      <button onClick={() => confirmDelete('Delete this education entry?', async () => { try { await deleteEducation(edu._id); toast.success('Deleted'); loadAll() } catch { toast.error('Failed') } setConfirm(null) })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"><RiDeleteBinLine size={14} /></button>
                    </div>
                  </div>
                ))}
                {education.length === 0 && <div className="text-center py-8 text-slate card"><p>No education entries yet</p></div>}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-ink">Certifications</h3>
                <button onClick={() => setModal({ type: 'certificate' })} className="btn-primary text-sm"><RiAddLine size={15} /> Add Certificate</button>
              </div>
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert._id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xl shrink-0">🏅</span>
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-sm text-ink truncate">{cert.name}</p>
                        <p className="text-slate text-xs">{cert.org} · {cert.year}</p>
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noreferrer" className="text-accent text-xs font-mono flex items-center gap-1 mt-0.5 hover:underline">
                            <RiExternalLinkLine size={11} /> View Certificate
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all">
                          <RiEyeLine size={14} />
                        </a>
                      )}
                      <button onClick={() => setModal({ type: 'certificate', data: cert })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-accent hover:text-accent transition-all"><RiEditLine size={14} /></button>
                      <button onClick={() => confirmDelete('Delete this certificate?', async () => { try { await deleteCertificate(cert._id); toast.success('Deleted'); loadAll() } catch { toast.error('Failed') } setConfirm(null) })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"><RiDeleteBinLine size={14} /></button>
                    </div>
                  </div>
                ))}
                {certificates.length === 0 && <div className="text-center py-8 text-slate card"><p>No certificates yet</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT INFO */}
        {tab === 'contact' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-ink">Contact Information</h2>
                <p className="text-slate text-sm mt-1">Updates reflect instantly on the portfolio contact page</p>
              </div>
              <button onClick={saveContactInfo} disabled={savingContact} className="btn-primary disabled:opacity-70">
                {savingContact ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><RiSaveLine size={16} /> Save Changes</>}
              </button>
            </div>
            <div className="card p-8">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: 'email', label: 'Email Address', placeholder: 'yash@email.com', type: 'email' },
                  { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', type: 'text' },
                  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', type: 'url' },
                  { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...', type: 'url' },
                  { key: 'portfolio', label: 'Portfolio URL (optional)', placeholder: 'https://yashkapse.dev', type: 'url' },
                  { key: 'address', label: 'Location / Address', placeholder: 'Nagpur, Maharashtra', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      value={contactInfo[field.key] || ''}
                      onChange={e => setContactInfo(c => ({ ...c, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-border flex justify-end">
                <button onClick={saveContactInfo} disabled={savingContact} className="btn-primary">
                  {savingContact ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm">✅ Changes saved here will automatically appear on the portfolio Contact page.</p>
            </div>
          </div>
        )}

        {/* RESUME */}
        {tab === 'resume' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">Resume Management</h2>
              <p className="text-slate text-sm mt-1">Upload your latest resume — the Download button on the portfolio will always serve the latest version</p>
            </div>

            {/* Current resume */}
            <div className="card p-6 mb-6">
              <h3 className="font-display font-semibold text-lg text-ink mb-4">Current Resume</h3>
              {resumeDoc ? (
                <div className="flex items-center justify-between gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-body font-semibold text-sm text-ink">{resumeDoc.filename || 'resume.pdf'}</p>
                      <p className="text-slate text-xs font-mono">
                        Uploaded: {new Date(resumeDoc.uploadedAt || resumeDoc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={resumeDoc.url} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
                      <RiEyeLine size={14} /> Preview
                    </a>
                    <a href={resumeDoc.url} download className="btn-ghost text-sm">
                      <RiDownloadLine size={14} /> Download
                    </a>
                    <button
                      onClick={() => confirmDelete('Delete the current resume? Visitors won\'t be able to download it.', async () => {
                        try { await deleteResume(); setResumeDoc(null); toast.success('Resume deleted') }
                        catch { toast.error('Failed to delete') } setConfirm(null)
                      })}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-slate hover:border-red-300 hover:text-red-500 transition-all"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-muted border border-dashed border-border rounded-xl text-center text-slate">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="font-body text-sm">No resume uploaded yet. Upload one below.</p>
                </div>
              )}
            </div>

            {/* Upload new */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-lg text-ink mb-4">
                {resumeDoc ? 'Replace Resume' : 'Upload Resume'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">Select PDF File</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} className="hidden" id="resumeFile" />
                    <label htmlFor="resumeFile" className="btn-ghost cursor-pointer">
                      <RiUploadLine size={16} /> {resumeFile ? resumeFile.name : 'Choose PDF File'}
                    </label>
                    {resumeFile && <span className="text-xs text-green-600 font-mono">✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>}
                  </div>
                </div>
                <button onClick={handleResumeUpload} disabled={!resumeFile || uploadingResume} className="btn-primary disabled:opacity-50">
                  {uploadingResume
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                    : <><RiUploadLine size={16} /> {resumeDoc ? 'Replace Resume' : 'Upload Resume'}</>}
                </button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-700 text-xs font-mono">
                  ⚠️ Requires Cloudinary to be configured in your backend .env file for cloud storage. Without it, place resume.pdf in frontend/public/ manually.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Modals */}
      {modal?.type === 'project' && <ProjectForm initial={modal.data} onSave={saveProject} onCancel={() => setModal(null)} />}
      {modal?.type === 'experience' && <ExperienceForm initial={modal.data} onSave={saveExperience} onCancel={() => setModal(null)} />}
      {modal?.type === 'education' && <EducationForm initial={modal.data} onSave={saveEducation} onCancel={() => setModal(null)} />}
      {modal?.type === 'certificate' && <CertificateForm initial={modal.data} onSave={saveCertificate} onCancel={() => setModal(null)} />}
      {modal?.type === 'hackathon' && <HackathonForm initial={modal.data} onSave={saveHackathon} onCancel={() => setModal(null)} />}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
