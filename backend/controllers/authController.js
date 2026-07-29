const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Admin } = require('../models')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const cleanUsername = username.trim()
    const admin = await Admin.findOne({
      username: { $regex: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    })
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, username: admin.username })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
