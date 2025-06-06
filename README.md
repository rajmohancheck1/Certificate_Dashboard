# 📄 Certificate Dashboard - Revenue Department

A complete MERN stack solution for managing certificate issuance with separate React frontend and Express backend servers.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen) 
![React](https://img.shields.io/badge/React-18.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+ or yarn
- MongoDB (local or Atlas)

```bash
git clone https://github.com/your-username/certificate-dashboard.git
cd certificate-dashboard
```

## ⚙️ Configuration

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Then edit .env file
```

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/certificate_db
JWT_SECRET=your_strong_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env  # Then edit .env file
```

**frontend/.env**
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🏃 Running the Application


```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd ../frontend && npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗 Project Structure

```
certificate-dashboard/
├── backend/
│   ├── config/       # DB & auth configs
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth middleware
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── utils/        # Helper functions
│   ├── app.js        # Express setup
│   └── server.js     # Server entry
│
├── frontend/
│   ├── public/       # Static assets
│   └── src/
│       ├── assets/   # Images/fonts
│       ├── components/ # Reusable UI
│       ├── context/  # React contexts
│       ├── hooks/    # Custom hooks
│       ├── pages/    # Route components
│       ├── services/ # API services
│       ├── App.jsx   # Root component
│       └── main.jsx  # Entry point
│
├── .gitignore
└── README.md
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    User->>Frontend: Login Request
    Frontend->>Backend: POST /api/auth/login
    Backend-->>Frontend: JWT Token
    Frontend->>LocalStorage: Store Token
    Frontend->>Backend: API Requests (with JWT)
    Backend-->>Frontend: Protected Data
```

## 📡 API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/login` | POST | User login | No |
| `/api/certificates` | GET | List certificates | Yes |
| `/api/certificates` | POST | Create new request | Yes (Public) |
| `/api/certificates/:id` | PATCH | Approve/reject | Yes (Officer+) |

## 🛡 Security Features

- 🔒 JWT Authentication
- 🔑 Role-based access control
- 🛡 Password encryption (bcrypt)
- ⏱ Rate limiting (express-rate-limit)
- 🧹 Input sanitization
- 🔗 CORS restricted to frontend origin

## 💡 Troubleshooting

**Common Issues:**
1. **Connection refused:**
   - Verify MongoDB is running
   - Check `.env` configuration
   - if localhost string is in env check Mongodb installation
   - if atlas string found check internet connection
     
2. **CORS errors:**
   - Ensure `FRONTEND_URL` matches your React app URL
3. **JWT errors:**
   - Verify token is being sent in Authorization header

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.
