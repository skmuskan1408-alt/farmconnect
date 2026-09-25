# 🚀 1-Click Single Platform Free Deployment for KissanConnect

Yes! You can deploy **both Frontend + Backend + Database together in ONE single service** on **Render.com** (100% Free).

---

## ⚡ How It Works (All-in-One Deployment)

Your Node Express backend is configured to automatically serve the React frontend app. When you deploy on **Render.com**, you get **one single URL** (e.g. `https://kissanconnect.onrender.com`) that handles everything:
- `https://kissanconnect.onrender.com/` → React App
- `https://kissanconnect.onrender.com/api` → Backend API & Database

---

## 🛠️ Step-by-Step Instructions (3 Simple Steps)

### Step 1: Push Code to GitHub
Make sure your project is committed and pushed to your GitHub account:
```bash
git add .
git commit -m "Configure all-in-one deployment"
git push origin main
```

---

### Step 2: Deploy on Render.com
1. Sign up / Log in to [Render.com](https://render.com) (Free Account).
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repository (`kissanconnect`).

> **If using Blueprint (Automated from `render.yaml`)**:
> Render will automatically detect `render.yaml` in your project and set up everything automatically! Just click **Apply**.

> **If creating manually as a Web Service**:
> - **Name**: `kissanconnect`
> - **Environment**: `Node`
> - **Build Command**:
>   ```bash
>   cd backend && npm install && node scripts/prepare-prisma.js && npx prisma db push && npm run build && node dist/seed.js && cd ../frontend && npm install && npm run build
>   ```
> - **Start Command**:
>   ```bash
>   cd backend && npm start
>   ```
> - **Instance Type**: **Free** ($0/mo)

---

### Step 3: Test Your App!
Once Render finishes building (approx. 3-4 minutes):
1. Open your Render Web URL (e.g., `https://kissanconnect.onrender.com`).
2. Your full-stack application is live!

#### Seeded Test Credentials:
- **Farmer**: `farmer@farmconnect.com` / `password123`
- **Consumer**: `consumer@farmconnect.com` / `password123`
- **Bulk Buyer**: `buyer@farmconnect.com` / `password123`

---

### 💡 (Optional) Persistent Cloud Database
By default, the server uses built-in SQLite. If you want database changes (like newly added products) to persist permanently even after server restarts, add a free **Neon PostgreSQL** database string as an Environment Variable in Render:
- Key: `DATABASE_URL`
- Value: `postgres://...` (from [Neon.tech](https://neon.tech))
