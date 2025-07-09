# 🎓 AI-Powered Career Guidance Web App

A full-stack MERN + MySQL web application that provides personalized career roadmaps for students and professionals using AI. Users can explore curated paths, track their progress visually, connect with institutions, and enroll in relevant courses — all in one place.

![Landing Page](./preview/landing-screenshot.png)

---

## 🚀 Features

- 🔐 **Google OAuth & Secure Auth** — Session-based login with role-based access (User, Institution, Admin).
- 🤖 **AI Career Roadmap Generator** — Uses OpenAI API to create dynamic, multi-path timelines based on user input.
- 🗺️ **Interactive Visual Roadmaps** — React Flow + Dagre layout with status tracking (Ongoing, Done).
- 📊 **Progress Tracking** — Dashboard shows visual goal progress from current stage to target career.
- 🏫 **Institution & Course Management** — Admins/institutions can manage courses and link them to roadmaps.
- 💳 **Stripe Integration** — Secure online payments for premium roadmap plans via Stripe Elements.
- 🔍 **Advanced Course Filtering** — Search by institution, duration, cost, and more.
- 📄 **Admin Panel** — Manage users, roles, institutions, course approvals, and more.

---

## 🛠️ Tech Stack

**Frontend**
- React.js + Tailwind CSS
- React Flow + Dagre Layout
- Axios for API requests
- Stripe Elements (CardElement)

**Backend**
- Node.js + Express.js
- MySQL (via Sequelize ORM)
- OpenAI API for roadmap generation
- Passport.js (Google OAuth 2.0)
- Stripe API

**Deployment**
- Vercel (Frontend)  
- Render or Railway (Backend & MySQL DB)

---

## 🧠 AI Career Roadmap Generator

User provides:
- 🎓 Education Level (e.g., O/Ls, A/Ls, Undergrad)
- 🎯 Career Goal (e.g., Full Stack Developer)
- 🔧 Skills, Interests, Past Experience

AI returns:
- 15–20 career steps with nested subtasks
- Multiple visual paths (flowchart-style)
- Vertical timeline UI with expandable steps
- Clickable progress tracking (color-coded status)

---

## 📸 Screenshots

| Feature | Preview |
|--------|---------|
| AI Roadmap | ![](./preview/ai-roadmap.png) |
| Dashboard | ![](./preview/dashboard.png) |
| Courses | ![](./preview/courses.png) |
| Payment Page | ![](./preview/payment.png) |

> Place your screenshots in a `/preview` folder inside the repo.

---

## 🧪 Local Development Setup

### 🔧 Prerequisites

- Node.js (v18+)
- MySQL Server
- OpenAI API Key
- Google OAuth Credentials
- Stripe Test Keys

---

### 📦 Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install

# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev
```

📚 Credits
OpenAI
Stripe
React Flow
Google Developers OAuth
Vercel / Render for deployment

👨‍💻 Author
Built with ❤️ by Titus Senthilkumaran
GitHub: @titussenthil
LinkedIn: linkedin.com/in/titussenthil
Email: [optional@example.com]

---

Let me know if:
- You want me to replace placeholders with real values (email, repo link, screenshots).
- You'd like a `LICENSE` file and `CONTRIBUTING.md` file as well.
- You want this file created and pushed to your GitHub repo directly (I’ll guide you through it).
