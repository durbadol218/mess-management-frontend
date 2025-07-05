# 🍽️ Mess Management System

**Mess Management System** is a full-stack web application built to streamline monthly mess billing, user registrations, and administrative oversight. It supports token-based authentication, role-based access (Admin & Member), monthly reports, and real-time status tracking.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Core Features](#-core-features)
- [Screens & Pages](#-screens--pages)
- [Technologies Used](#-technologies-used)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [How to Run Locally](#-how-to-run-locally)
- [Authentication Info](#-authentication-info)
- [Screenshots](#-screenshots)
- [Contact](#-contact)
- [License](#-license)

---

## 🔍 Overview

Mess Management System simplifies mess accounting by enabling users to register and track their monthly bills, while admins can monitor all users’ reports, control bill entries, and manage overall expenses efficiently. The system also features email notifications, JWT-based login, and responsive frontend design.

---

## 🚀 Live Demo

Frontend: [https://mess-management-frontend-five.vercel.app](https://mess-management-frontend-five.vercel.app)
Backend API: [https://mess-management-system-omega.vercel.app](https://mess-management-system-omega.vercel.app)

---
## 🚀 Core Features

### 👤 User Side:
- ✅ Register and Login with JWT token
- 📅 View and track monthly mess bills
- 🧾 Access billing history
- 🔐 Update profile and change password
- 📩 Receive email confirmation after registration or updates

### 🛠️ Admin Side:
- 👥 View and manage all user profiles
- 🧮 Add, update, and delete monthly bills
- 📊 View monthly report summaries
- 📨 Send billing notifications via email
- 📋 Role-based access controls

---

## 🖼️ Screens & Pages

### Frontend Pages:
- `index.html` – Landing Page
- `register.html` / `login.html` – Authentication
- `dashboard.html` – User/Member Dashboard
- `admin-dashboard.html` – Admin Dashboard
- `add-bill.html` / `edit-bill.html` – Bill Management
- `profile.html` – User Profile
- `contact.html` / `about.html` – Informational Pages

---

## 🧪 Technologies Used

### 💻 Frontend:
- HTML5, CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- Chart.js (for visual reports)

### 🖥️ Backend:
- Python 3
- Django 4.x
- Django REST Framework (DRF)
- SQLite / PostgreSQL (optional)
- Django Email Backend (SMTP)

---

### 📦 Other Tools
- **PostgreSQL** (or SQLite)
- **Vercel** for frontend deployment
- **Render** for backend hosting (Django API)

---

## 📁 Folder Structure

### Frontend (`FlowerWorld Modified FE/`)
📁 image/  
📁 css/  
📁 js/  
📁 admin/  
📄 index.html  
📄 register.html  
📄 login.html  
📄 profile.html  
📄 flower_details.html  

### Backend (`FlowerWorld/`)
📁 FlowerWorld/ # Django settings  
📁 flowers/ # Flower model, views, serializers  
📁 order/ # Order model & logic  
📁 user/ # Custom user model & auth  
📁 payment/ # Payment success/failure pages  
📄 manage.py  
📄 requirements.txt  
📄 db.sqlite3  

---

## ⚙️ API Endpoints

> ✅ Protected routes require `Authorization: Bearer <token>`

- `POST /api/register/` — Create user
- `POST /api/login/` — Login and get token
- `GET /api/user/profile/` — Get profile
- `PUT /api/user/profile/update/` — Update profile
- `GET /api/bills/` — View monthly bills
- `POST /api/bills/` — Add new bill (admin only)
- `PUT /api/bills/<id>/` — Edit bill
- `DELETE /api/bills/<id>/` — Delete bill
- `GET /api/reports/summary/` — Monthly summary

---

## ✅ How to Run Locally

### Backend Setup
```bash
git clone https://github.com/durbadol218/Mess-Management-System.git
cd mess-management-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### ▶️ Frontend Setup
Open `index.html` directly in a browser for local testing, or deploy the frontend folder to [Vercel](https://vercel.com).

> 💡 You can configure `.env` or settings.py for your own API keys and email credentials.

---

## 🔐 Authentication Info

- Register at `/users/register/`
- Login at `/users/login/` (returns JWT token)
- Access protected endpoints using:
```http
Authorization: Bearer <your_token>
```
---
## 💌 Contact

**Project Owner:** Durbadol Goswami  
📧 Email: goswamidurbadol@gmail.com  
🌐 Portfolio: https://responsive-portfolio-blond.vercel.app/  
🔗 GitHub: https://github.com/durbadol218

---

## 📃 License

This project is licensed under the MIT License. Feel free to use and customize as needed.
