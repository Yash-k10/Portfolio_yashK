import axios from 'axios'

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '')
const baseURL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 seconds to accommodate Render free tier cold starts
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.status, err.response?.data || err.message)
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// ─── Public ───────────────────────────────────────────────────────────────────
export const getProjects    = ()     => api.get('/projects')
export const getProject     = (id)   => api.get(`/projects/${id}`)
export const getSkills      = ()     => api.get('/skills')
export const getAbout       = ()     => api.get('/about')
export const getExperience  = ()     => api.get('/experience')
export const getEducation   = ()     => api.get('/education')
export const getCertificates= ()     => api.get('/certificates')
export const getHackathons  = ()     => api.get('/hackathons')
export const getHackathon   = (id)   => api.get(`/hackathons/${id}`)
export const getContactInfo = ()     => api.get('/contact-info')
export const getResume      = ()     => api.get('/resume')
export const sendContact    = (data) => api.post('/contact', data)

// ─── Admin — Projects ─────────────────────────────────────────────────────────
export const createProject  = (data) => api.post('/projects', data)
export const updateProject  = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject  = (id)   => api.delete(`/projects/${id}`)

// ─── Admin — Skills / About ───────────────────────────────────────────────────
export const updateSkills   = (data) => api.put('/skills', data)
export const updateAbout    = (data) => api.put('/about', data)
export const uploadAvatar   = (formData) =>
  api.post('/about/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })

// ─── Admin — Experience ───────────────────────────────────────────────────────
export const createExperience = (data) => api.post('/experience', data)
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data)
export const deleteExperience = (id)   => api.delete(`/experience/${id}`)

// ─── Admin — Education ────────────────────────────────────────────────────────
export const createEducation = (data) => api.post('/education', data)
export const updateEducation = (id, data) => api.put(`/education/${id}`, data)
export const deleteEducation = (id)   => api.delete(`/education/${id}`)

// ─── Admin — Certificates ─────────────────────────────────────────────────────
export const createCertificate = (formData) =>
  api.post('/certificates', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateCertificate = (id, formData) =>
  api.put(`/certificates/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`)

// ─── Admin — Hackathons ───────────────────────────────────────────────────────
export const createHackathon = (formData) =>
  api.post('/hackathons', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateHackathon = (id, formData) =>
  api.put(`/hackathons/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteHackathon = (id) => api.delete(`/hackathons/${id}`)

// ─── Admin — Contact Info ─────────────────────────────────────────────────────
export const updateContactInfo = (data) => api.put('/contact-info', data)

// ─── Admin — Resume ───────────────────────────────────────────────────────────
export const uploadResume = (formData) =>
  api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
export const deleteResume = () => api.delete('/resume')

// ─── Admin — Image upload ─────────────────────────────────────────────────────
export const uploadImage = (formData) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export default api
