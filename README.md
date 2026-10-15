# 🛒 Abracart — Modern Full-Stack MERN E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-02042B?style=flat&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)

Abracart is a production-ready, full-stack MERN e-commerce web application featuring household essentials, electronics, fashion, and books. It includes seamless **Razorpay payment gateway integration**, **real-time synchronized wishlist state**, **luxury dark/light mode toggle**, and **floating glassmorphism micro-animations**.

---

## ✨ Features

- **🛍️ Dynamic Product Catalog & Search**: Instant multi-category filtering, keyword search, price/stock filters, and detailed product showcase.
- **🔐 Secure Authentication**: JWT authentication stored in secure `HttpOnly` cross-origin cookies with full protected routes.
- **🛒 Robust Cart Management**: Server-synced shopping cart with stock quantity bounds, subtotal calculations, and instant badge updates.
- **💖 Real-Time Synchronized Wishlist**: Global state syncing wishlist items instantly across Navbar badges, Product Cards, and the Wishlist page without page reloads.
- **💳 Razorpay Payment Gateway**:
  - Server-side pre-order creation with stock checking.
  - Razorpay standard checkout modal.
  - Cryptographic HMAC-SHA256 signature verification.
  - Automatic order placement, receipt generation, and cart flushing upon successful payment.
- **📦 Order History & Tracking**: Detailed order receipt page (`/order-success/:id`), order history list (`/orders`), and status progression workflow (`PLACED` ➔ `CONFIRMED` ➔ `SHIPPED` ➔ `DELIVERED`).
- **🌙 Luxury Dark & Light Mode**: Seamless theme toggle persisted in `localStorage` with rich obsidian `#0B0F14` dark palette.
- **✨ Micro-Animations & Floating Toasts**: Heart burst pop effects, badge bounce animations, and frosted glass toast notifications.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js (REST API, CORS, Cookie-Parser) |
| **Database** | MongoDB Atlas, Mongoose ORM |
| **Payments** | Razorpay Node.js SDK & Razorpay Checkout.js |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, HMAC-SHA256 signatures |

---

## 📁 Project Structure

```text
shopping-app/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── razorpay.js         # Razorpay SDK initialization
│   ├── controllers/
│   │   ├── cart.controller.js
│   │   ├── customer.controller.js
│   │   ├── order.controller.js  # Razorpay order creation & payment verification
│   │   └── product.controller.js
│   ├── models/
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   └── product.routes.js
│   ├── seedProducts.js         # Database seeding script
│   ├── index.js                # Express app entry point & health check
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, ProductCard, CartItem, WishlistCard, SearchBar
│   │   ├── context/            # CartContext, WishlistContext, ThemeContext, ToastContext
│   │   ├── pages/              # Products, ProductDetails, Cart, Checkout, Orders, Home, Login, Register
│   │   ├── services/           # api.js (Axios instance with credentials & dynamic URLs)
│   │   ├── App.jsx
│   │   ├── index.css           # Tailwind v4 theme, animations & custom variants
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
