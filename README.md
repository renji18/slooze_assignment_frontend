# 🍽 Slooze Frontend

This is the frontend for the **Slooze Assignment**, a team-based food ordering platform built using **Next.js App Router**, **Tailwind CSS**, and **TypeScript**.

It connects to the Slooze NestJS backend for authentication, restaurant data, orders, and more.

---

## ✨ Features

- 🔐 JWT Cookie-based Authentication
- 🦸‍♂️ Comic-style login for demo users
- 👥 Role-based access (Admin, Manager, Member)
- 🌍 Region-based restaurant and order views
- 🛒 Cart with dynamic add/remove logic
- 🧾 Order listing with status, region, actions
- 🔄 Reusable Protected Layouts

---

## 🚀 Getting Started

### 1. Clone the Repo

```code
git clone https://github.com/your-username/slooze-frontend.git
cd slooze-frontend
npm install
```

### 2. Run the App
Make sure that the app is running on port 3000. In case it isn't you will need to update and allow your origin in the cors permissions in the backend src/main.ts

```code
npm run dev
```

## 🧑‍💻 Tech Stack

- ⚛️ **Next.js 14** (App Router)
- 🎨 **Tailwind CSS** for utility-first styling
- 💡 **TypeScript** for type safety and DX
- 🌐 **Axios** for HTTP requests to the backend
- 🍞 **Sonner** for clean toast notifications
- 🧠 **JWT (via cookies)** for authentication
- 🧩 Modular architecture using components, hooks, and layouts

---

## 🧪 Demo Users

Use these pre-seeded accounts to log in from the homepage.  
**Password for all users:** `password123`

| 👤 Name            | 🛡 Role         | 🌍 Region   |
|--------------------|----------------|-------------|
| Captain Marvel     | Manager        | India       |
| Captain America    | Manager        | America     |
| Thanos             | Team Member    | India       |
| Thor               | Team Member    | India       |
| Travis             | Team Member    | America     |

👉 On the homepage, simply click on a user card to pre-fill the login form.