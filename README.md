# Yash Kapse — Portfolio Website

**Machine Learning Engineer Portfolio** | React + Node.js + MongoDB

---

## 🗂️ Project Structure

```
portfolio/
├── frontend/          # React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/          # Hero section
│   │   │   ├── About/         # About page
│   │   │   ├── Skills/        # Skills + proficiency bars
│   │   │   ├── Projects/      # Project cards + detail page
│   │   │   ├── Resume/        # Resume categories + download
│   │   │   ├── Experience/    # Timeline cards
│   │   │   ├── Contact/       # Contact form + info
│   │   │   ├── Admin/         # Admin login + dashboard
│   │   │   └── Layout/        # Side nav + animated background
│   │   ├── context/           # Auth context (JWT)
│   │   └── utils/             # API client + static data
│   └── vercel.json
└── backend/           # Node.js + Express + MongoDB
    ├── config/        # DB + Cloudinary setup
    ├── controllers/   # Route handlers
    ├── middleware/     # JWT auth
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    ├── server.js      # Entry point
    ├── seed.js        # DB seeder
    └── render.yaml    # Render deploy config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier — for image uploads)

---

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string (32+ chars) |
| `ADMIN_USERNAME` | Your admin username |
| `ADMIN_PASSWORD` | Your admin password |
| `CLOUDINARY_*` | From cloudinary.com dashboard |
| `EMAIL_USER` | Gmail address for contact form |
| `EMAIL_PASS` | Gmail App Password |
| `EMAIL_TO` | Where contact emails are sent |
| `FRONTEND_URL` | Your Vercel frontend URL |

**Seed the database:**
```bash
node seed.js
```

**Start backend:**
```bash
npm run dev    # development
npm start      # production
```

---

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_URL=http://localhost:5000
```

**Start frontend:**
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔐 Admin Panel

- URL: `/admin/login`
- Default credentials from `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- **Change before deploying to production!**

Admin features:
- ✅ Add / Edit / Delete projects (with image upload)
- ✅ Edit skills categories
- ✅ Edit about text
- ✅ Manage experience entries
- ✅ View contact messages

---

## 🌐 Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

### Backend → Render

1. Push `backend/` to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set all environment variables from `.env.example`
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Deploy, then run seed: open Render Shell → `node seed.js`

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Icons | React Icons (Remix Icons) |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Images | Cloudinary |
| Email | Nodemailer (Gmail) |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render |

---

## 📁 Key Files

- `frontend/src/utils/staticData.js` — Edit default projects/skills/experience shown without backend
- `frontend/src/utils/api.js` — All API calls
- `backend/seed.js` — Seeds admin + default data
- `backend/models/index.js` — All Mongoose schemas

---

## 📄 Adding Your Resume PDF

Place your resume as `frontend/public/resume.pdf` — the download button links to it automatically.

---

## 🛠️ Customization

**Colors:** Edit `tailwind.config.js` → `colors`  
**Fonts:** Edit `frontend/index.html` Google Fonts link + `tailwind.config.js`  
**Static data:** Edit `frontend/src/utils/staticData.js` for default content  
**Contact info:** Edit `frontend/src/components/Contact/Contact.jsx`  

---

Made with ❤️ by Yash Kapse
