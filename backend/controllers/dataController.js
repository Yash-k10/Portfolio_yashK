const {
  Skills, About, Experience, Education,
  Certificate, Hackathon, ContactInfo, Resume, Contact
} = require('../models')
const { cloudinary } = require('../config/cloudinary')
const nodemailer = require('nodemailer')

// ─── SKILLS ──────────────────────────────────────────────────────────────────
exports.getSkills = async (req, res) => {
  try {
    const doc = await Skills.findOne()
    res.json(doc?.categories || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.updateSkills = async (req, res) => {
  try {
    const doc = await Skills.findOneAndUpdate(
      {}, { categories: req.body }, { new: true, upsert: true }
    )
    res.json(doc.categories)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
exports.getAbout = async (req, res) => {
  try {
    const doc = await About.findOne()
    res.json(doc || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.updateAbout = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'Text required' })
    const doc = await About.findOneAndUpdate({}, { text }, { new: true, upsert: true })
    res.json(doc)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' })
    const url = req.file.path || req.file.secure_url
    const doc = await About.findOneAndUpdate({}, { avatar: url }, { new: true, upsert: true })
    res.json(doc)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
exports.getAllExperience = async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.createExperience = async (req, res) => {
  try {
    // Handle description: can be array or newline-separated string
    let body = { ...req.body }
    if (typeof body.description === 'string') {
      body.description = body.description.split('\n').map(s => s.trim()).filter(Boolean)
    }
    if (typeof body.tech === 'string') {
      body.tech = body.tech.split(',').map(s => s.trim()).filter(Boolean)
    }
    const item = await Experience.create(body)
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.updateExperience = async (req, res) => {
  try {
    let body = { ...req.body }
    if (typeof body.description === 'string') {
      body.description = body.description.split('\n').map(s => s.trim()).filter(Boolean)
    }
    if (typeof body.tech === 'string') {
      body.tech = body.tech.split(',').map(s => s.trim()).filter(Boolean)
    }
    const item = await Experience.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────
exports.getAllEducation = async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.createEducation = async (req, res) => {
  try {
    const item = await Education.create(req.body)
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.updateEducation = async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.deleteEducation = async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
}

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────
exports.getAllCertificates = async (req, res) => {
  try {
    const items = await Certificate.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.createCertificate = async (req, res) => {
  try {
    const body = { ...req.body }
    // If file was uploaded via multer
    if (req.file) {
      body.url = req.file.path || req.file.secure_url
      body.filePublicId = req.file.filename || req.file.public_id || ''
    }
    const item = await Certificate.create(body)
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.updateCertificate = async (req, res) => {
  try {
    const body = { ...req.body }
    if (req.file) {
      body.url = req.file.path || req.file.secure_url
      body.filePublicId = req.file.filename || req.file.public_id || ''
    }
    const item = await Certificate.findByIdAndUpdate(req.params.id, body, { new: true })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.deleteCertificate = async (req, res) => {
  try {
    const item = await Certificate.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    // Delete from Cloudinary if exists
    if (item.filePublicId && process.env.CLOUDINARY_CLOUD_NAME) {
      try { await cloudinary.uploader.destroy(item.filePublicId) } catch (_) {}
    }
    await Certificate.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
}

// ─── HACKATHONS ───────────────────────────────────────────────────────────────
exports.getAllHackathons = async (req, res) => {
  try {
    const items = await Hackathon.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.getOneHackathon = async (req, res) => {
  try {
    const item = await Hackathon.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Hackathon not found' })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.createHackathon = async (req, res) => {
  try {
    const body = { ...req.body }
    if (typeof body.tech === 'string') {
      body.tech = body.tech.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (req.file) {
      body.image = req.file.path || req.file.secure_url
    }
    const item = await Hackathon.create(body)
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.updateHackathon = async (req, res) => {
  try {
    const body = { ...req.body }
    if (typeof body.tech === 'string') {
      body.tech = body.tech.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (req.file) {
      body.image = req.file.path || req.file.secure_url
    }
    const item = await Hackathon.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.deleteHackathon = async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
}

// ─── CONTACT INFO ─────────────────────────────────────────────────────────────
exports.getContactInfo = async (req, res) => {
  try {
    const doc = await ContactInfo.findOne()
    res.json(doc || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.updateContactInfo = async (req, res) => {
  try {
    const doc = await ContactInfo.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    res.json(doc)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

// ─── RESUME ───────────────────────────────────────────────────────────────────
exports.getResume = async (req, res) => {
  try {
    const doc = await Resume.findOne().sort({ createdAt: -1 })
    res.json(doc || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    // Delete old resume from Cloudinary
    const old = await Resume.findOne()
    if (old?.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
      try { await cloudinary.uploader.destroy(old.publicId, { resource_type: 'raw' }) } catch (_) {}
    }
    await Resume.deleteMany({})

    const doc = await Resume.create({
      url: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id || '',
      filename: req.file.originalname || 'resume.pdf',
      uploadedAt: new Date(),
    })
    res.status(201).json(doc)
  } catch (err) { res.status(400).json({ error: err.message }) }
}

exports.deleteResume = async (req, res) => {
  try {
    const doc = await Resume.findOne()
    if (!doc) return res.status(404).json({ error: 'No resume found' })
    if (doc.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
      try { await cloudinary.uploader.destroy(doc.publicId, { resource_type: 'raw' }) } catch (_) {}
    }
    await Resume.deleteMany({})
    res.json({ message: 'Resume deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
}

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
exports.sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing' })

    await Contact.create({ name, email, subject, message })

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Portfolio] ${subject || 'New message'} from ${name}`,
        html: `<div style="font-family:sans-serif"><h2>New Message</h2><p><b>From:</b> ${name} (${email})</p><p><b>Subject:</b> ${subject || 'N/A'}</p><hr/><p>${message}</p></div>`,
      })
    }
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: 'Failed to send message' }) }
}

exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) { res.status(500).json({ error: err.message }) }
}
