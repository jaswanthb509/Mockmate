# MockMate

> An AI-powered mock interview platform designed to help students and job seekers practice technical interviews, receive AI-generated feedback, and improve their interview performance.

## 🚀 Live Demo

**Frontend:** https://mockmate-eight-xi.vercel.app/

**Backend:** https://mockmate-tbll.onrender.com/

---

## 📌 About the Project

MockMate is a full-stack AI-powered interview preparation platform that simulates real interview experiences.

Users can prepare for interviews based on their target role and company, answer AI-generated interview questions, submit answers, and receive feedback to identify areas for improvement.

The platform focuses on making interview preparation more personalized, interactive, and accessible.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password authentication
- JWT-based authentication
- Forgot password functionality
- Email-based password reset
- Protected application routes

### 🤖 AI-Powered Interviews
- AI-generated interview questions
- Role-specific interview preparation
- Company-focused interview preparation
- Technical and behavioral questions
- Dynamic interview sessions

### 🎤 Interview Experience
- Interactive mock interview interface
- Answer questions individually
- Voice-based answer support
- Speech-to-text interview responses
- Real-time interview progress

### 📊 Interview Results
- Review completed interviews
- AI-generated feedback
- Identify strengths and weaknesses
- Performance insights
- Suggestions for improvement

### 🎨 User Interface
- Modern dark-themed interface
- Responsive design
- Dashboard-based navigation
- Clean interview workflow
- User-friendly authentication pages

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Router

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- MongoDB Atlas

### AI
- Google Gemini API

### Authentication & Security
- JWT
- bcrypt
- Protected API routes
- Environment variables

### Email
- Brevo / SMTP email services
- Password recovery emails

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Project Structure

```text
Mockmate/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── index.html
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── server.js
│
└── README.md
