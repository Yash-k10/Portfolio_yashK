const cloudinary = require('cloudinary').v2
const multer = require('multer')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Image upload (projects)
let imageUpload
// Certificate/resume upload (PDF + images)
let fileUpload

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Use direct Cloudinary upload via multer memoryStorage + manual upload
  // This avoids multer-storage-cloudinary version compatibility issues entirely
  const memUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  })

  // Middleware: upload image to Cloudinary from memory buffer
  const cloudinaryUploadMiddleware = (folder, resourceType = 'image') => {
    return (req, res, next) => {
      if (!req.file) return next()

      const uploadOptions = {
        folder,
        resource_type: resourceType,
      }

      // Use upload_stream for buffer uploads
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          return next(error)
        }
        // Attach Cloudinary result to req.file so controllers can read it
        req.file.path = result.secure_url
        req.file.secure_url = result.secure_url
        req.file.filename = result.public_id
        req.file.public_id = result.public_id
        next()
      })

      // Pipe the buffer into the upload stream
      const { Readable } = require('stream')
      const readable = new Readable()
      readable.push(req.file.buffer)
      readable.push(null)
      readable.pipe(stream)
    }
  }

  // Image upload middleware (for projects, hackathons)
  imageUpload = {
    single: (fieldName) => [
      multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith('image/')) cb(null, true)
          else cb(new Error('Only image files allowed'), false)
        },
      }).single(fieldName),
      cloudinaryUploadMiddleware('portfolio/images', 'image'),
    ],
  }

  // File upload middleware (for PDFs and images - resume, certificates)
  fileUpload = {
    single: (fieldName) => [
      multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
          if (allowed.includes(file.mimetype)) cb(null, true)
          else cb(new Error('Only PDF or image files allowed'), false)
        },
      }).single(fieldName),
      (req, res, next) => {
        if (!req.file) return next()
        const isPdf = req.file.mimetype === 'application/pdf'
        const folder = isPdf ? 'portfolio/documents' : 'portfolio/certificates'
        const resourceType = isPdf ? 'raw' : 'image'
        cloudinaryUploadMiddleware(folder, resourceType)(req, res, next)
      },
    ],
  }

  console.log('☁️  Cloudinary storage configured')
} else {
  // Fallback: memory storage if Cloudinary not configured
  console.log('⚠️  Cloudinary not configured — using memory storage fallback')
  const memStorage = multer({ storage: multer.memoryStorage() })
  // Wrap in array to match the Cloudinary branch interface
  imageUpload = { single: (fieldName) => [memStorage.single(fieldName)] }
  fileUpload = { single: (fieldName) => [memStorage.single(fieldName)] }
}

module.exports = { imageUpload, fileUpload, cloudinary }
