export const STATIC_PROJECTS = [
  {
    _id: '1',
    title: 'AI PDF Chatbot',
    slug: 'ai-pdf-chatbot',
    description: 'Conversational AI that ingests any PDF and answers questions with context-aware responses using RAG architecture.',
    tech: ['Python', 'LangChain', 'OpenAI', 'FAISS', 'Streamlit'],
    github: 'https://github.com/yashkapse',
    live: 'https://ai-pdf-chatbot.vercel.app',
    image: null,
    problem: 'Reading lengthy research papers and documents is time-consuming. Users needed a way to query large PDFs instantly.',
    approach: 'Built a Retrieval-Augmented Generation pipeline using LangChain + FAISS vector store. PDFs are chunked, embedded with OpenAI embeddings, and stored for semantic search. User queries are matched against chunks and fed into GPT-4 for precise answers.',
    results: 'Reduced document analysis time by 80%. Handles PDFs up to 500 pages with sub-second retrieval. Achieved 91% answer accuracy on benchmark QA pairs.',
    category: 'AI/ML',
  },
  {
    _id: '2',
    title: 'IoT Anomaly Detection System',
    slug: 'iot-detection-system',
    description: 'Real-time anomaly detection for IoT sensor streams using LSTM autoencoders with live alerting dashboard.',
    tech: ['Python', 'TensorFlow', 'MQTT', 'React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/yashkapse',
    live: null,
    image: null,
    problem: 'Industrial IoT sensors generate massive data streams. Manual monitoring is impossible and failures go undetected until critical damage occurs.',
    approach: 'Designed an LSTM autoencoder trained on normal sensor behavior. Reconstruction error above a dynamic threshold triggers alerts. Built an MQTT subscriber pipeline feeding a real-time React dashboard with historical analysis.',
    results: 'Detected 97.3% of injected anomalies in testing. Reduced false positives by 64% vs threshold-only baselines. System handles 10,000+ sensor readings/sec.',
    category: 'AI/ML',
  },
  {
    _id: '3',
    title: 'Sales Forecasting Model',
    slug: 'sales-forecasting-model',
    description: 'Time-series forecasting pipeline combining XGBoost and Prophet for multi-store retail sales prediction.',
    tech: ['Python', 'XGBoost', 'Prophet', 'Pandas', 'Plotly', 'FastAPI'],
    github: 'https://github.com/yashkapse',
    live: null,
    image: null,
    problem: 'Retail chains face significant inventory waste from inaccurate demand forecasting, leading to stockouts or overstock situations.',
    approach: 'Engineered 40+ lag and rolling features. Trained an ensemble of XGBoost and Facebook Prophet. Built a FastAPI microservice exposing forecasts, served via an interactive Plotly dashboard with confidence intervals.',
    results: 'Achieved MAPE of 4.2% on 12-week horizon. Outperformed baseline ARIMA by 38%. Deployed on Render serving live predictions for demo dataset.',
    category: 'Data Science',
  },
  {
    _id: '4',
    title: 'NLP Resume Classifier',
    slug: 'nlp-resume-classifier',
    description: 'Automated resume screening system that classifies candidates into job categories using fine-tuned BERT.',
    tech: ['Python', 'HuggingFace', 'BERT', 'Scikit-learn', 'Flask', 'React'],
    github: 'https://github.com/yashkapse',
    live: 'https://resume-classifier.vercel.app',
    image: null,
    problem: 'HR teams spend hours manually screening hundreds of resumes. Inconsistent evaluation leads to missed talent and bias.',
    approach: 'Fine-tuned BERT-base on a labeled resume dataset across 25 job categories. Built a preprocessing pipeline handling PDF/DOCX extraction, cleaning, and tokenization. Flask REST API + React frontend with confidence scores and top matching skills highlighted.',
    results: '94.7% classification accuracy across 25 categories. Processes 200 resumes/minute. Reduced initial screening time from 3 hours to 4 minutes per batch.',
    category: 'NLP',
  },
]

export const STATIC_SKILLS = {
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

export const STATIC_EXPERIENCE = [
  {
    _id: '1',
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
  },
  {
    _id: '2',
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
  },
]

export const ABOUT_TEXT = `I'm Yash Kapse, a Machine Learning Engineer passionate about building intelligent systems that convert raw data into real-world impact. I specialize in end-to-end ML pipelines — from exploratory analysis and feature engineering to model deployment and monitoring.

With hands-on experience in deep learning, NLP, and computer vision, I thrive at the intersection of research and engineering. I've built production-grade solutions ranging from conversational AI systems to time-series forecasters, always optimizing for both performance and scalability.

When I'm not training models, I'm exploring the latest in LLMs, contributing to open-source, and turning complex problems into elegant data-driven solutions.`
