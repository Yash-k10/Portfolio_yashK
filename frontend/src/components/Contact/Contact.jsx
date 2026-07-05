import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import toast from 'react-hot-toast'
import {
  RiMailLine, RiPhoneLine, RiLinkedinLine, RiGithubLine,
  RiSendPlaneLine, RiMapPinLine, RiGlobalLine
} from 'react-icons/ri'
import { sendContact, getContactInfo } from '../../utils/api'

const DEFAULT_CONTACT = {
  email: 'yash.kapse@email.com',
  phone: '+91 98765 43210',
  linkedin: 'https://linkedin.com/in/yashkapse',
  github: 'https://github.com/yashkapse',
  portfolio: '',
  address: 'Nagpur, Maharashtra 🇮🇳',
}

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT)

  useEffect(() => {
    getContactInfo()
      .then(r => r.data && setContactInfo({ ...DEFAULT_CONTACT, ...r.data }))
      .catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setSending(true)
    try {
      await sendContact(form)
      toast.success("Message sent! I'll get back to you soon 🚀")
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please email me directly.')
    } finally {
      setSending(false)
    }
  }

  const contactItems = [
    { icon: RiMailLine, label: 'Email', value: contactInfo.email, href: contactInfo.email ? `mailto:${contactInfo.email}` : null },
    { icon: RiPhoneLine, label: 'Phone', value: contactInfo.phone, href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/\s/g, '')}` : null },
    { icon: RiLinkedinLine, label: 'LinkedIn', value: contactInfo.linkedin ? contactInfo.linkedin.replace('https://', '') : '', href: contactInfo.linkedin || null },
    { icon: RiGithubLine, label: 'GitHub', value: contactInfo.github ? contactInfo.github.replace('https://', '') : '', href: contactInfo.github || null },
    ...(contactInfo.portfolio ? [{ icon: RiGlobalLine, label: 'Portfolio', value: contactInfo.portfolio.replace('https://', ''), href: contactInfo.portfolio }] : []),
    ...(contactInfo.address ? [{ icon: RiMapPinLine, label: 'Location', value: contactInfo.address, href: null }] : []),
  ].filter(item => item.value)

  return (
    <section className="section-wrapper min-h-screen" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="section-tag mb-4">Contact</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 leading-tight">
          Let's <span className="gradient-text">Collaborate</span>
        </h2>
        <p className="text-slate font-body text-lg max-w-xl">
          Open to ML roles, freelance projects, and research collaborations. Let's build something intelligent together.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="space-y-3 mb-8">
            {contactItems.map((info, i) => {
              const Icon = info.icon
              const content = (
                <div className="card p-4 flex items-center gap-4 hover:border-accent-mid group transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-300">
                    <Icon size={18} className="text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate uppercase tracking-widest">{info.label}</p>
                    <p className="text-ink font-body font-medium text-sm truncate">{info.value}</p>
                  </div>
                </div>
              )
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  {info.href ? (
                    <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      {content}
                    </a>
                  ) : content}
                </motion.div>
              )
            })}
          </div>

          {/* Availability card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="card p-6 bg-gradient-to-br from-accent to-blue-400"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white font-mono text-sm font-medium">Available for Work</span>
            </div>
            <p className="text-blue-100 font-body text-sm leading-relaxed">
              Currently open to full-time ML Engineer positions, data science internships, and interesting AI projects. Response time: within 24 hours.
            </p>
          </motion.div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="card p-8">
            <h3 className="font-display font-semibold text-xl text-ink mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project or opportunity..." rows={5} className="input-field resize-none" required />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3 disabled:opacity-70 disabled:cursor-not-allowed">
                {sending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><RiSendPlaneLine size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
