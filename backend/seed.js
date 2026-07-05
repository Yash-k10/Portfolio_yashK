require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Admin, Skills, About, Experience } = require('./models')

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234'

console.log('Using credentials:', ADMIN_USERNAME, ADMIN_PASSWORD)

const DEFAULT_SKILLS = {
  'ML / AI': {
    icon: '🤖',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging Face', 'LangChain', 'OpenCV', 'NLTK'],
  },
  'Data Science': {
    icon: '📊',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'EDA', 'Statistics', 'SQL'],
  },
  'Web Dev': {
    icon: '🌐',
    skills: ['React', 'Node.js', 'Express', 'REST APIs', 'Tailwind CSS', 'HTML/CSS'],
  },
  'Databases': {
    icon: '🗄️',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'FAISS', 'Pinecone'],
  },
  'Tools & DevOps': {
    icon: '🛠️',
    skills: ['Git', 'Docker', 'Postman', 'VS Code', 'Jupyter', 'Linux', 'Vercel', 'Render'],
  },
}

const DEFAULT_ABOUT = `I'm Yash Kapse, a Machine Learning Engineer passionate about building intelligent systems that convert raw data into real-world impact. I specialize in end-to-end ML pipelines — from exploratory analysis and feature engineering to model deployment and monitoring.

With hands-on experience in deep learning, NLP, and computer vision, I thrive at the intersection of research and engineering. I've built production-grade solutions ranging from conversational AI systems to time-series forecasters, always optimizing for both performance and scalability.

When I'm not training models, I'm exploring the latest in LLMs, contributing to open-source, and turning complex problems into elegant data-driven solutions.`

const DEFAULT_EXPERIENCE = [
  {
    role: 'Machine Learning Intern',
    company: 'TechVision AI',
    duration: 'Jun 2024 – Aug 2024',
    location: 'Remote',
    description: [
      'Built a customer churn prediction model using XGBoost, achieving 89% accuracy.',
      'Automated data ingestion pipelines processing 500K+ records daily with Apache Airflow.',
      'Developed interactive dashboards in Plotly Dash for real-time business insights.',
    ],
    tech: ['Python', 'XGBoost', 'Airflow', 'Plotly'],
    order: 0,
  },
  {
    role: 'Data Science Intern',
    company: 'DataPulse Analytics',
    duration: 'Jan 2024 – May 2024',
    location: 'Nagpur, MH',
    description: [
      'Performed EDA on 2M+ transaction records; uncovered key revenue patterns.',
      'Implemented NLP sentiment analysis pipeline for product reviews using BERT.',
      'Collaborated with cross-functional teams to deliver weekly insight reports.',
    ],
    tech: ['Python', 'BERT', 'Pandas', 'Power BI'],
    order: 1,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Admin — force delete old and recreate with current .env credentials
    await Admin.deleteMany({})
    console.log('🗑️  Old admin cleared')
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await Admin.create({ username: ADMIN_USERNAME, password: hashed })
    console.log(`✅ Admin created: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`)

    // Skills
    await Skills.findOneAndUpdate({}, { categories: DEFAULT_SKILLS }, { upsert: true })
    console.log('✅ Skills seeded')

    // About
    await About.findOneAndUpdate({}, { text: DEFAULT_ABOUT }, { upsert: true })
    console.log('✅ About seeded')

    // Experience — force delete and recreate
    await Experience.deleteMany({})
    await Experience.insertMany(DEFAULT_EXPERIENCE)
    console.log('✅ Experience seeded')

    console.log('\n🎉 Database seeded successfully!')
    console.log(`\nAdmin credentials:\n  Username: ${ADMIN_USERNAME}\n  Password: ${ADMIN_PASSWORD}`)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()