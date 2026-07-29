require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const routes = require('./routes')

const app = express()

// ─── Connect DB ───────────────────────────────────────────────────────────────
connectDB()

// ─── Security & CORS Middleware ────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean).flatMap(url => url.split(',').map(u => u.trim().replace(/\/+$/, '')))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)

    const normalized = origin.replace(/\/+$/, '')
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(normalized)) {
      return callback(null, true)
    }

    // Fallback: allow common deployment preview domains (Vercel, Netlify, Render)
    if (
      normalized.endsWith('.vercel.app') ||
      normalized.endsWith('.netlify.app') ||
      normalized.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true)
    }

    return callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Rate limiting (skip OPTIONS preflight requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many requests, please try again later.' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many login attempts, please try again later.' },
})

app.use('/api', limiter)
app.use('/api/auth', authLimiter)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Yash Kapse Portfolio API', version: '1.0.0', status: 'running' })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
