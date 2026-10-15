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
│   ├── .env.example
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
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to set up and run the project locally.

### 1. Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or a local MongoDB instance)
- [Razorpay Test Account](https://dashboard.razorpay.com/) (to obtain Key ID & Secret)

---

### 2. Clone the Repository

```bash
git clone https://github.com/Rudra30507/abracart.git
cd abracart
```

---

### 3. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your credentials:
   ```env
   # Server Configuration
   PORT=1001
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/abracart?retryWrites=true&w=majority

   # Authentication Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Razorpay Payment Gateway Credentials (from Razorpay Dashboard > Settings > API Keys)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Allowed Frontend Origin
   CLIENT_URL=http://localhost:5173
   ```

5. Seed initial products into MongoDB:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on [http://localhost:1001](http://localhost:1001).*

---

### 4. Frontend Setup

1. Open a **new terminal** window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Verify `.env` content:
   ```env
   VITE_API_URL=http://localhost:1001
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be live at [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port the Express server listens on | `1001` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing authentication tokens | `your_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay Test Key ID | `rzp_test_xxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Key Secret | `xxxxxxxxxxxxxxxx` |
| `CLIENT_URL` | Frontend origin for CORS and cookies | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend base URL for API requests | `http://localhost:1001` |

---

## 📡 API Endpoints Overview

### Health Check
- `GET /health` — Check server status & uptime

### Customers / Authentication (`/customers`)
- `POST /customers/register` — Register a new customer
- `POST /customers/login` — Login customer & set HttpOnly cookie
- `GET /customers/me` — Get authenticated customer profile
- `POST /customers/logout` — Clear session cookie
- `GET /customers/wishlist` — Get customer's saved wishlist items
- `POST /customers/wishlist/:productId` — Toggle product in wishlist
- `DELETE /customers/wishlist/:productId` — Remove product from wishlist

### Products (`/products`)
- `GET /products` — Get products with category, price filter & pagination
- `GET /products/:id` — Get single product details by ID

### Cart (`/cart`)
- `GET /cart` — Get active customer cart
- `POST /cart` — Add item to cart
- `PATCH /cart/:productId` — Update item quantity (stock bounded)
- `DELETE /cart/:productId` — Remove item from cart

### Orders & Payments (`/orders`)
- `POST /orders/create-payment` — Validate cart stock & generate Razorpay Order ID
- `POST /orders/verify-payment` — Verify cryptographic signature & confirm order
- `GET /orders` — Retrieve user's order history
- `GET /orders/:id` — Retrieve specific order receipt details
- `PATCH /orders/:id/status` — Advance order status (Bonus testing endpoint)

---

## 🌐 Production Deployment

### Backend (e.g. Render / Railway)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Set all production environment variables (`NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`, etc.).

### Frontend (e.g. Vercel / Netlify)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set `VITE_API_URL` to your production backend URL (e.g. `https://your-backend.onrender.com`).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
