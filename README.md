# 📚 BookWise LMS — University Library Management System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0A0A0A?style=for-the-badge&logo=drizzle&logoColor=yellow)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js-blue?style=for-the-badge&logo=auth0)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

### ✨ Overview
**BookWise LMS** is a modern and intelligent **Library Management System** built with **Next.js**.  
It enables students to **browse and borrow books** online, while **admins manage users and books** through a powerful admin dashboard.  
The app features **secure authentication**, **role-based access**, and a **clean responsive UI**.

---

## 🚀 Features

### 🔐 Authentication System
- Secure **Sign Up / Sign In** with **NextAuth.js**
- **Role-based access control** (Admin / User)

---

### 🏠 Pages Overview
- **Home Page** → A welcoming dashboard introducing the library.  
- **Library Page** → Displays available books with the **Search Bar**.  
- **Book Details Page** → Detailed view of each book (title, author, category, availability).  
- **Profile Page** → Displays user details and borrowing history.

---

### 🛠️ Admin Panel
Accessible **only to admins** for full control over the system.

#### 🧰 Admin Capabilities
- ➕ Add new books  
- ✏️ Edit existing books  
- ❌ Delete books  
- 👥 View and manage users  
- 🔄 Update **user status** (Approved / Pending)

> ⚠️ Users with **Pending** status cannot borrow books until approved by an admin.

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | Neon Postgres |
| **ORM** | Drizzle ORM |
| **Authentication** | NextAuth.js |
| **Language** | TypeScript / JavaScript |

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/bookwise-lms.git
cd bookwise-lms
