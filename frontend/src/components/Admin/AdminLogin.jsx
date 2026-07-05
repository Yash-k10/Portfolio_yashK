import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { RiLockLine, RiUser3Line, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)

    try {
      console.log('Attempting login with:', form.username)

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        toast.error(data.error || 'Invalid credentials')
        return
      }

      if (data.token) {
        login(data.token)
        toast.success('Welcome back!')
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error('No token received')
      }
    } catch (err) {
      console.error('Login fetch error:', err)
      toast.error('Cannot connect to backend. Is it running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob w-96 h-96 bg-blue-100 opacity-40" style={{ top: '-5%', right: '-5%' }} />
        <div className="blob w-64 h-64 bg-indigo-100 opacity-30" style={{ bottom: '10%', left: '-5%' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <RiLockLine size={24} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-ink mb-1">Admin Panel</h1>
            <p className="text-slate font-body text-sm">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <RiUser3Line size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  className="input-field pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <RiLockLine size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition-colors"
                >
                  {showPw ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-70"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign In'
              }
            </button>
          </form>

          <p className="text-center text-slate font-body text-xs mt-6">
            Protected area · Unauthorized access prohibited
          </p>
        </div>
      </motion.div>
    </div>
  )
}