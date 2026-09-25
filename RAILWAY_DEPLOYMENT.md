# 🚆 Railway Deployment Guide: KissanConnect Full-Stack Application

This document provides step-by-step instructions to deploy **KissanConnect** as **ONE Railway Project** containing:
1. **PostgreSQL Database** (Railway Database)
2. **Backend Service** (Node.js + Express + Prisma)
3. **Frontend Service** (React + TypeScript + Vite + Tailwind)

---

## 📋 Railway Architecture Overview

```
                      +------------------------------------------+
                      |         Railway Project: KissanConnect   |
                      |                                          |
                      |   +----------------------------------+   |
                      |   |       PostgreSQL Database        |   |
                      |   +----------------------------------+   |
                      |                    ^                     |
                      |                    | (DATABASE_URL)      |
                      |                    v                     |
+------------------+  |   +----------------------------------+   |
|   User Browser   | <===> |    Backend Service (Express API)  |   |
+------------------+  |   +----------------------------------+   |
        ^             |                    ^                     |
        |             |                    | (VITE_API_URL)      |
        +==================================+                     |
                      |   |    Frontend Service (Vite Static)  |   |
                      |   +----------------------------------+   |
                      +------------------------------------------+
```

---

## 🛠️ Detailed Step-by-Step Railway Setup Guide

### A. Create Railway Project
1. Log in to [Railway.app](https://railway.app).
2. Click **+ New Project**.

---

### B. Add PostgreSQL Database Service
1. Inside your new Railway Project canvas, click **+ New** → **Database** → **Add PostgreSQL**.
2. Railway will create a managed PostgreSQL instance instantly.
3. Keep this service running inside your project canvas.

---

### C. Deploy Backend Service from GitHub
1. In the same Railway Project, click **+ New** → **GitHub Repo**.
2. Select your `kissanconnect` repository.
3. Rename this newly added service in Railway to `backend`.

---

### D. Set Backend Root Directory
1. Click on the `backend` service settings tab.
2. Under **Root Directory**, enter:
   - `backend` (or `farmconnect/backend` if your repo root contains `farmconnect`).

---

### E. Set Backend Build Command
1. In the `backend` service settings → **Build Command**, enter:
   ```bash
   npm install && npx prisma generate && node scripts/prepare-prisma.js && npx prisma db push && npm run build && node dist/seed.js
   ```

---

### F. Set Backend Start Command
1. In the `backend` service settings → **Start Command**, enter:
   ```bash
   npm start
   ```

---

### G. Connect DATABASE_URL to Backend
1. Go to `backend` service → **Variables** tab.
2. Click **+ New Variable** → **Add Reference Value**.
3. Select your Railway **PostgreSQL** service and reference `DATABASE_URL` (or paste `${{Postgres.DATABASE_URL}}`).

---

### H. Set Backend Environment Variables
In the `backend` service **Variables** tab, add:
- `JWT_SECRET` = `kissanconnect_production_jwt_secret_sih2026_key`
- `NODE_ENV` = `production`
- `PORT` = `5000` *(Railway automatically provides PORT, but setting default 5000 is safe)*
- `FRONTEND_URL` = `https://<YOUR-FRONTEND-DOMAN>.up.railway.app` *(update once frontend domain is generated in Step M)*

---

### I. Deploy Frontend Service from the Same GitHub Repo
1. Back on the Railway Project canvas, click **+ New** → **GitHub Repo**.
2. Select the **same** `kissanconnect` repository again.
3. Rename this second service to `frontend`.

---

### J. Set Frontend Root Directory
1. Click on the `frontend` service settings tab.
2. Under **Root Directory**, enter:
   - `frontend` (or `farmconnect/frontend` if repo root contains `farmconnect`).

---

### K. Set Frontend Build Command
1. In `frontend` service settings → **Build Command**:
   ```bash
   npm install && npm run build
   ```
2. **Start Command** / **Output Directory**:
   - For static web deployment, set Output Directory to `dist`.

---

### L. Set VITE_API_URL on Frontend
1. Generate a public domain for your `backend` service (Service Settings → **Networking** → **Generate Domain**, e.g., `https://kissanconnect-backend-production.up.railway.app`).
2. Go to `frontend` service → **Variables** tab and add:
   - `VITE_API_URL` = `https://kissanconnect-backend-production.up.railway.app/api`

---

### M. Generate Frontend Public Domain
1. Go to `frontend` service settings → **Networking** → **Public Networking**.
2. Click **Generate Domain** (e.g., `https://kissanconnect-frontend-production.up.railway.app`).

---

### N. Configure Backend CORS with Frontend URL
1. Go back to `backend` service → **Variables** tab.
2. Set/Update `FRONTEND_URL` = `https://kissanconnect-frontend-production.up.railway.app`
3. Railway will automatically redeploy the backend service with the updated CORS configuration.

---

### O. Test Complete Application
1. Open your frontend public URL (`https://kissanconnect-frontend-production.up.railway.app`).
2. Verify API Health by opening `https://kissanconnect-backend-production.up.railway.app/api/health`.
3. Log in with pre-seeded demo accounts:
   - **Farmer Demo**: `farmer.demo@kissanconnect.com` / `Demo@123`
   - **Consumer Demo**: `consumer.demo@kissanconnect.com` / `Demo@123`
   - **Bulk Buyer Demo**: `bulk.demo@kissanconnect.com` / `Demo@123`
   - **Admin Demo**: `admin.demo@kissanconnect.com` / `Demo@123`

---

## 🔒 Verification & Compliance Summary

- [x] No existing features removed.
- [x] UI layout and styling completely preserved.
- [x] Express + Prisma architecture untouched.
- [x] Database provider set to `postgresql`.
- [x] Backend listens on dynamic `process.env.PORT` bound to `0.0.0.0`.
- [x] Frontend `api.ts` uses `VITE_API_URL`.
- [x] Backend CORS supports dynamic `FRONTEND_URL`.
- [x] Real API secrets excluded from version control via updated `.env.example` files.
- [x] Local production build test completed cleanly for both backend and frontend (`exit code 0`).
