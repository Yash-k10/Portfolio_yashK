require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Admin } = require('./models')

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Show all admins in DB
    const allAdmins = await Admin.find({})
    console.log('All admins in DB:', JSON.stringify(allAdmins, null, 2))

    // Try manual password compare
    const username = process.env.ADMIN_USERNAME
    const password = process.env.ADMIN_PASSWORD
    console.log('\nTesting login with:', username, password)

    const admin = await Admin.findOne({ username })
    console.log('Found admin:', admin ? 'YES' : 'NO')

    if (admin) {
      const match = await bcrypt.compare(password, admin.password)
      console.log('Password match:', match)

      // Also try lowercase username
      const adminLower = await Admin.findOne({ username: username.toLowerCase() })
      console.log('Found with lowercase:', adminLower ? 'YES' : 'NO')
    }

  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

test()