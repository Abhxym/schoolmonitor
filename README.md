# 🏫 SchoolMonitor — ZP Maharashtra

A full-stack school monitoring and management system for **Zilla Parishad schools in Maharashtra**. Built with Next.js 16, Express, MongoDB Atlas, Cloudinary, and Nodemailer.

---

## ✨ Features

### Public
- School directory with individual school detail pages
- Live attendance transparency metrics
- Approved campus events listing
- Photo gallery with category filter and lightbox
- Contact form with email confirmation

### Kendrapramuk (Admin)
- Network-wide attendance analytics and export
- Event approval / rejection with email notification to Mukhyadhyapak
- Form responses review (mark reviewed / flag)
- GR document upload to Cloudinary with delete
- Dynamic form builder deployed to Mukhyadhyapak portals
- User management — assign roles and schools to users
- Notification bell with real-time unread count

### Mukhyadhyapak (Headmaster)
- School-scoped dashboard with live KPIs
- Manual attendance submission
- Event registration (pending Kendrapramuk approval)
- Report submission with email notification to Kendrapramuk
- GR document viewer with Cloudinary download links
- System resources — Excel export of attendance data

### Auth
- JWT credential login
- Google OAuth via NextAuth.js
- Forgot password → real email with reset link
- Password reset page with token validation
- Role-based route protection (ProtectedRoute)
- Token expiry detection with auto-logout

---

## 🗂 Project Structure

```
SE/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (admin)/          # Kendrapramuk pages
│   │   ├── (auth)/           # Login, forgot/reset password
│   │   ├── (headmaster)/     # Mukhyadhyapak pages
│   │   ├── (public)/         # Public-facing pages
│   │   └── api/auth/         # NextAuth route handler
│   ├── components/           # UI + feature components
│   ├── context/              # AuthContext
│   ├── hooks/                # useAttendance, useEvents, useNotifications, useRole
│   ├── services/             # Axios API layer
│   └── utils/                # exportExcel, rolePermissions, formatDate
└── backend/
    ├── models/               # Mongoose models
    ├── routes/               # Express route handlers
    ├── middleware/           # auth, rbac, validate, upload
    ├── cloudinary.js         # Cloudinary config
    ├── mailer.js             # Nodemailer transporter
    ├── emailTemplates.js     # Branded HTML email templates
    ├── notificationTemplates.js # Event/report notification emails
    ├── mongoose.js           # MongoDB connection
    ├── seed.js               # Auto-seed on first run
    └── index.js              # Express server entry point
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free M0 tier works)
- A Cloudinary account (free tier)
- A Gmail account with App Password enabled

### 1. Clone and install

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Frontend environment — `.env.local`

Create this file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Backend environment — `backend/.env`

```env
PORT=5000
JWT_SECRET=your-jwt-secret-here
ALLOWED_ORIGIN=http://localhost:3000

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/schoolmonitor?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

MAIL_USER=your-gmail@gmail.com
MAIL_PASS=your-16-char-app-password
MAIL_FROM=SchoolMonitor ZP <your-gmail@gmail.com>
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Kendrapramuk | `kendrapramuk@zp.edu` | `admin123` |
| Mukhyadhyapak (Pune) | `hm.pune@zp.edu` | `hm123` |
| Mukhyadhyapak (Nashik) | `hm.nashik@zp.edu` | `hm123` |
| Mukhyadhyapak (Nagpur) | `hm.nagpur@zp.edu` | `hm123` |

All 12 Mukhyadhyapak accounts follow the pattern `hm.<district>@zp.edu` / `hm123`.

---

## 🔐 RBAC Summary

| Action | Kendrapramuk | Mukhyadhyapak |
|--------|:---:|:---:|
| View all schools | ✅ | ❌ (own only) |
| View all attendance | ✅ | ❌ (own only) |
| Submit attendance | ❌ | ✅ |
| Approve events | ✅ | ❌ |
| Create events | ❌ | ✅ |
| View all reports | ✅ | ❌ (own only) |
| Submit reports | ❌ | ✅ |
| Upload GR documents | ✅ | ❌ |
| View GR documents | ✅ | ✅ |
| Manage users | ✅ | ❌ |
| View notifications | ✅ | ❌ |

---

## 📧 Email Flows

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Forgot password | User | Reset link (1hr expiry) |
| Contact form submit | Submitter + Admin | Confirmation + admin notification |
| Event submitted | Kendrapramuk | Event details + approval link |
| Event approved/rejected | Mukhyadhyapak | Status update |
| Report submitted | Kendrapramuk | Report details |

---

## ☁️ Deployment

See [Render (backend)](#render-backend) and [Vercel (frontend)](#vercel-frontend) sections below.

### Render (Backend)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from `backend/.env`
6. Change `ALLOWED_ORIGIN` to your Vercel frontend URL

### Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `/` (project root)
3. Add all environment variables from `.env.local`
4. Change `NEXT_PUBLIC_API_URL` to your Render backend URL + `/api`
5. Change `NEXTAUTH_URL` to your Vercel deployment URL

### Google OAuth redirect URI

After deploying, add to Google Cloud Console → OAuth 2.0 Client:
```
https://your-vercel-app.vercel.app/api/auth/callback/google
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Framer Motion, Recharts |
| Auth | JWT, NextAuth.js, Google OAuth |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| File Storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Styling | CSS Modules + inline styles |
| Export | xlsx (Excel) |
| Rate Limiting | express-rate-limit |
