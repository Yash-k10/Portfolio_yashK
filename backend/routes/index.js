const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const authCtrl = require('../controllers/authController')
const projectCtrl = require('../controllers/projectController')
const dataCtrl = require('../controllers/dataController')
const { imageUpload, fileUpload } = require('../config/cloudinary')

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/login', authCtrl.login)

// ─── Projects ─────────────────────────────────────────────────────────────────
router.get('/projects', projectCtrl.getAll)
router.get('/projects/:id', projectCtrl.getOne)
router.post('/projects', auth, projectCtrl.create)
router.put('/projects/:id', auth, projectCtrl.update)
router.delete('/projects/:id', auth, projectCtrl.remove)

// ─── Skills ───────────────────────────────────────────────────────────────────
router.get('/skills', dataCtrl.getSkills)
router.put('/skills', auth, dataCtrl.updateSkills)

// ─── About ────────────────────────────────────────────────────────────────────
router.get('/about', dataCtrl.getAbout)
router.put('/about', auth, dataCtrl.updateAbout)
router.post('/about/avatar', auth, ...imageUpload.single('avatar'), dataCtrl.uploadAvatar)

// ─── Experience ───────────────────────────────────────────────────────────────
router.get('/experience', dataCtrl.getAllExperience)
router.post('/experience', auth, dataCtrl.createExperience)
router.put('/experience/:id', auth, dataCtrl.updateExperience)
router.delete('/experience/:id', auth, dataCtrl.deleteExperience)

// ─── Education ────────────────────────────────────────────────────────────────
router.get('/education', dataCtrl.getAllEducation)
router.post('/education', auth, dataCtrl.createEducation)
router.put('/education/:id', auth, dataCtrl.updateEducation)
router.delete('/education/:id', auth, dataCtrl.deleteEducation)

// ─── Certificates ─────────────────────────────────────────────────────────────
router.get('/certificates', dataCtrl.getAllCertificates)
router.post('/certificates', auth, ...fileUpload.single('file'), dataCtrl.createCertificate)
router.put('/certificates/:id', auth, ...fileUpload.single('file'), dataCtrl.updateCertificate)
router.delete('/certificates/:id', auth, dataCtrl.deleteCertificate)

// ─── Hackathons ───────────────────────────────────────────────────────────────
router.get('/hackathons', dataCtrl.getAllHackathons)
router.get('/hackathons/:id', dataCtrl.getOneHackathon)
router.post('/hackathons', auth, ...imageUpload.single('image'), dataCtrl.createHackathon)
router.put('/hackathons/:id', auth, ...imageUpload.single('image'), dataCtrl.updateHackathon)
router.delete('/hackathons/:id', auth, dataCtrl.deleteHackathon)

// ─── Contact Info ─────────────────────────────────────────────────────────────
router.get('/contact-info', dataCtrl.getContactInfo)
router.put('/contact-info', auth, dataCtrl.updateContactInfo)

// ─── Resume ───────────────────────────────────────────────────────────────────
router.get('/resume', dataCtrl.getResume)
router.post('/resume', auth, ...fileUpload.single('resume'), dataCtrl.uploadResume)
router.delete('/resume', auth, dataCtrl.deleteResume)

// ─── Contact Messages ─────────────────────────────────────────────────────────
router.post('/contact', dataCtrl.sendContact)
router.get('/contact/messages', auth, dataCtrl.getMessages)

// ─── Image Upload ─────────────────────────────────────────────────────────────
router.post('/upload', auth, ...imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: req.file.path || req.file.secure_url, public_id: req.file.filename })
})

// ─── Health ───────────────────────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

module.exports = router
