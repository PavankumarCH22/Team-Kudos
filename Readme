# Team Kudos - Internal Team Feedback & Peer Kudos Wall

**Team Kudos** is a full-stack production-style MERN platform that allows employees to appreciate colleagues by sending kudos points, selecting company value tags, reacting to appreciation posts, viewing live monthly leaderboards, and tracking recognition metrics.

---

## 🌟 Key Features

- **JWT Authentication & Rotation**: Short-lived access tokens (15 mins) and long-lived refresh tokens (7 days) stored in `httpOnly` cookies with token rotation.
- **Simulated Verification & Password Reset**: Documented simulation for college presentation.
- **Atomic Kudos Point Transfers**: MongoDB transaction handling (with fallback for standalone MongoDB instances) guaranteeing deduction of sender giving allowance and addition to recipient earned points without double spending.
- **Give Kudos Modal**: Recipient autocomplete search, point selector (10, 20, 50), value tags (`#Teamwork`, `#CustomerObsession`, `#Innovation`), and message input.
- **Social Recognition Feed**: Paginated feed with filter options, search, optimistic emoji reactions (`+1`, `👏`, `🔥`), loading skeletons, and empty state handlers.
- **Monthly Leaderboard**: MongoDB aggregation pipeline (`$match`, `$group`, `$sort`, `$limit`) with Top 3 visual highlights (Gold, Silver, Bronze podium).
- **Monthly Allowance Reset**: Node-cron background job scheduled for the 1st of every month + CLI command (`npm run reset-allowance`) tracked idempotently via `ResetLog`.
- **Admin Control Center**: System metrics dashboard (total employees, kudos sent, points distributed, department breakdown), employee role/allowance editor, and manual reset trigger.
- **13 Complete Pages**: Login, Signup, Verify Email, Forgot Password, Reset Password, Dashboard, Kudos Feed, Give Kudos Modal, Profile, Leaderboard, Department Analytics, Admin Dashboard, and 404 Page.

---

## 🛠️ Technology Stack

- **Frontend**: React (v18), Vite, Tailwind CSS, Lucide React Icons, React Router (v6), Axios, Context API.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, node-cron.
- **Testing**: Jest + Supertest.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@teamkudos.com` | `Password123!` |
| **Employee (Engineering)** | `alex.rivera@teamkudos.com` | `Password123!` |
| **Employee (Design)** | `maya.lin@teamkudos.com` | `Password123!` |
| **Employee (Sales)** | `daniel.blake@teamkudos.com` | `Password123!` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure Node.js (v18+) and MongoDB are installed and running locally on port `27017`.

### 2. Install Dependencies
Run from project root directory:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Seed Database
Generate 1 Admin and 16 Demo Employees with sample kudos activity:
```bash
npm run seed
```

### 4. Run Development Servers
Start both backend (Port 5000) and frontend (Port 5173):
```bash
# In terminal 1 (Backend):
npm --prefix server run dev

# In terminal 2 (Frontend):
npm --prefix client run dev
```

Visit **http://localhost:5173** in your web browser!

---

## 🧪 Testing & Utilities

### Run Automated Backend Tests
```bash
npm test
```

### Test Monthly Allowance Reset Manually
```bash
npm run reset-allowance
```

---

## 📡 API Reference Endpoint Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new employee | Public |
| `POST` | `/api/auth/login` | Authenticate & set httpOnly cookies | Public |
| `POST` | `/api/auth/refresh` | Refresh access token via rotation | Public |
| `POST` | `/api/auth/logout` | Revoke session & clear cookies | Public |
| `GET` | `/api/users/me` | Fetch logged-in user profile | Protected |
| `GET` | `/api/users` | Autocomplete employee search | Protected |
| `POST` | `/api/kudos` | Create atomic kudos point transfer | Protected |
| `GET` | `/api/kudos` | Get social feed (paginated) | Protected |
| `POST` | `/api/kudos/:id/reactions` | Toggle emoji reaction (+1, 👏, 🔥) | Protected |
| `GET` | `/api/leaderboard` | Get monthly rankings aggregation | Protected |
| `GET` | `/api/admin/dashboard` | Get admin metrics & statistics | Admin |
| `POST` | `/api/admin/reset-allowance` | Manually trigger allowance reset | Admin |
