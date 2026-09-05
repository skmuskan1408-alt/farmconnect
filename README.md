# FARMCONNECT — Digital Farmer-to-Consumer Marketplace (SIH26033)

> **Tagline:** *"From Farm to Your Table — Directly."*

FARMCONNECT is a real full-stack web application built for **Smart India Hackathon 2026 (Problem Code: SIH26033 — Farmer-to-Consumer Platform)**. It eliminates multiple intermediary layers, connecting Farmers/FPOs directly with Consumers and Bulk Buyers.

The platform provides **AI Demand Forecasting**, **Smart Route Optimization**, **Transparent Price Comparison**, **Safe Demo Payments**, **Real-Time Order Tracking**, and **Role-Based Access Control**.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express.js, TypeScript
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing

---

## 📂 Project Structure

```
farmconnect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # 17 relational database models
│   │   └── seed.ts            # Indian agricultural demo data seed
│   ├── src/
│   │   ├── config/            # Environment & server config
│   │   ├── controllers/       # Auth, Product, Cart, Order, Delivery, AI Forecast, Bulk, Chat, Review, Admin
│   │   ├── middleware/        # JWT Auth & RBAC middleware, Error handler
│   │   ├── routes/            # REST API router endpoints
│   │   ├── services/          # AI Forecast, TSP Route Optimization, Price Comparison
│   │   ├── utils/             # JWT sign/verify helpers
│   │   └── server.ts          # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Common, Product, Logistics, Forecast, Chat
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── layouts/           # MainLayout, DashboardLayout
│   │   ├── pages/             # Landing, Login, Register, Marketplace, Details, Cart, Checkout, Tracking, Bulk, Dashboards
│   │   ├── services/          # Axios API client with JWT interceptor
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx            # Route configuration
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Backend Setup

```bash
cd farmconnect/backend

# Install dependencies
npm install

# Initialize database schema
npx prisma db push

# Seed demo Indian agricultural data (Farmers, Products, Orders, AI demand logs)
npx ts-node prisma/seed.ts

# Build TypeScript
npm run build

# Start Backend API server (runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup

```bash
cd farmconnect/frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Start Vite Development Server (runs on http://localhost:3000)
npx vite --port 3000
```

---

## 🔑 One-Click Hackathon Demo Accounts

All accounts use password: **`password123`**

| Role | Email | Name / Location | Key Features |
|---|---|---|---|
| **🌾 Farmer** | `ramesh.farmer@farmconnect.in` | Ramesh Kumar (Madanapalle, AP) | Manage produce, add items, view AI demand forecasts & route optimization |
| **🛒 Consumer** | `priya.consumer@gmail.com` | Priya Sharma (Bengaluru, KA) | Browse produce, compare prices, cart, checkout, order timeline tracking |
| **🏢 Bulk Buyer** | `procure@bigbasketco.com` | BigBasket Procurement | Post high-volume requests, review farmer quotes, accept/reject offers |
| **🛡️ Admin** | `admin@farmconnect.in` | System Administrator | Platform revenue analytics, user directory, system order audit ledger |

---

## 🧠 Key Features & Modules

1. **AI Demand Forecasting (`forecastService.ts`)**:
   - Calculates 7-day and 30-day crop demand using a weighted moving average with seasonal harvest trend adjustments.
   - Generates confidence scores, percentage growth, and recommended farmer stock buffers.
2. **Smart Route Optimization (`routeOptimizationService.ts`)**:
   - Uses Nearest Neighbor TSP (Traveling Salesperson Problem) heuristic algorithm for multi-stop dispatches.
   - Computes distance saved (km), time saved (mins), and efficiency gain %.
3. **Transparent Price Comparison Engine (`priceComparisonService.ts`)**:
   - Dynamic comparison showing FarmConnect direct farm gate prices vs Local Mandis vs Supermarket retail prices.
4. **Safe Demo Payment System**:
   - Simulated payment modal for BHIM/UPI, Cards, and COD without requiring external payment gateway credentials during hackathon judging.

---

## 📄 Environment Variables (`backend/.env`)

```env
PORT=5000
DATABASE_URL="file:./dev.db" # Or postgresql://user:password@localhost:5432/farmconnect
JWT_SECRET="farmconnect_super_secret_jwt_key_sih2026_998877"
NODE_ENV="development"
```
