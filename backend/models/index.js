const mongoose = require('mongoose')

// ─── Admin User ───────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true })

// ─── Project ──────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true },
  description: { type: String, required: true },
  tech: [{ type: String }],
  category: { type: String, default: 'AI/ML' },
  github: { type: String, default: '' },
  live: { type: String, default: '' },
  image: { type: String, default: '' },
  problem: { type: String, default: '' },
  approach: { type: String, default: '' },
  results: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

projectSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
  next()
})

// ─── Skills ───────────────────────────────────────────────────────────────────
const skillsSchema = new mongoose.Schema({
  categories: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true })

// ─── About ────────────────────────────────────────────────────────────────────
const aboutSchema = new mongoose.Schema({
  text: { type: String, required: true },
  avatar: { type: String, default: '' },
}, { timestamps: true })

// ─── Experience ───────────────────────────────────────────────────────────────
const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  description: [{ type: String }],
  tech: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Education ────────────────────────────────────────────────────────────────
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Certificate ──────────────────────────────────────────────────────────────
const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  org: { type: String, required: true },
  year: { type: String, required: true },
  url: { type: String, default: '' },        // external link OR uploaded file URL
  filePublicId: { type: String, default: '' }, // cloudinary public_id for deletion
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Contact Info ─────────────────────────────────────────────────────────────
const contactInfoSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true })

// ─── Resume ───────────────────────────────────────────────────────────────────
const resumeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  filename: { type: String, default: 'resume.pdf' },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true })

// ─── Hackathon ────────────────────────────────────────────────────────────────
const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organizer: { type: String, default: '' },
  date: { type: String, required: true },
  location: { type: String, default: '' },
  role: { type: String, default: '' },          // e.g. "Team Lead", "Participant"
  result: { type: String, default: '' },        // e.g. "Winner", "Finalist", "Top 10"
  description: { type: String, default: '' },
  tech: [{ type: String }],
  image: { type: String, default: '' },
  certificateUrl: { type: String, default: '' }, // optional proof/certificate link
  projectUrl: { type: String, default: '' },      // optional github/demo link
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Contact Message ──────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = {
  Admin: mongoose.model('Admin', adminSchema),
  Project: mongoose.model('Project', projectSchema),
  Skills: mongoose.model('Skills', skillsSchema),
  About: mongoose.model('About', aboutSchema),
  Experience: mongoose.model('Experience', experienceSchema),
  Education: mongoose.model('Education', educationSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Hackathon: mongoose.model('Hackathon', hackathonSchema),
  ContactInfo: mongoose.model('ContactInfo', contactInfoSchema),
  Resume: mongoose.model('Resume', resumeSchema),
  Contact: mongoose.model('Contact', contactSchema),
}
