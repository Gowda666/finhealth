# FinHealth Public Deployment & Production Guide

This guide walks you through deploying the complete FinHealth full-stack application publicly with zero hosting costs using modern cloud platforms:

* **Backend**: Deployed on [Render](https://render.com) (or [Railway](https://railway.app)) as a Python Web Service
* **Frontend**: Deployed on [Vercel](https://vercel.com) (or [Netlify](https://netlify.com)) as a Vite React Single Page Application
* **Source Code**: Hosted on a **Public GitHub Repository** under the **MIT License**

---

## 1. Preparing Your Public GitHub Repository

### Step 1.1: Initialize Git in your project
Open a terminal in the root `finhealth` folder (`C:\Users\Pavan\.gemini\antigravity\scratch\finhealth`):

```bash
cd C:\Users\Pavan\.gemini\antigravity\scratch\finhealth
git init
git add .
git commit -m "feat: initial commit of FinHealth bank statement analytics full-stack app"
```

### Step 1.2: Create a Public GitHub Repository
1. Navigate to [GitHub New Repository](https://github.com/new).
2. Repository Name: `finhealth`
3. Description: `Privacy-first bank statement analysis and financial health monitoring full-stack web app`
4. Visibility: **Public**
5. Do **not** initialize with README or license (they are already created in your project).
6. Click **Create repository**.

### Step 1.3: Push your local codebase to GitHub
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/finhealth.git
git branch -M main
git push -u origin main
```

---

## 2. Deploying the Backend on Render

Render provides free hosting for Python FastAPI web services with automatic HTTPS and continuous deployment from GitHub.

### Step 2.1: Create Web Service on Render
1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub account.
4. Select the `finhealth` repository.

### Step 2.2: Configure Service Settings
* **Name**: `finhealth-api` (or a custom unique name)
* **Region**: Choose the closest region (e.g., Singapore, Frankfurt, or Oregon)
* **Root Directory**: `backend`
* **Runtime**: `Python 3`
* **Build Command**:
  ```bash
  pip install --upgrade pip && pip install -r requirements.txt
  ```
* **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
* **Instance Type**: `Free`

### Step 2.3: Set Environment Variables on Render
Click on the **Environment Variables** tab and add:
| Key | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.12.0` | Matches project Python runtime |
| `ENVIRONMENT` | `production` | Deployment mode |
| `MAX_UPLOAD_SIZE_MB`| `15` | Max upload file size |
| `CORS_ORIGINS` | `https://<YOUR-FRONTEND-APP>.vercel.app,http://localhost:5173` | Allowed frontend domains (or `*`) |

### Step 2.4: Deploy and Verify
1. Click **Create Web Service**. Render will clone, build dependencies, and start Uvicorn.
2. Note your live backend URL (e.g. `https://finhealth-api.onrender.com`).
3. Verify in browser: `https://finhealth-api.onrender.com/api/health`
   Should return: `{"status": "healthy", "service": "FinHealth API", ...}`

---

## 3. Alternative Backend: Deploying on Railway

If you prefer Railway:
1. Go to [railway.app](https://railway.app) and click **New Project** > **Deploy from GitHub repo**.
2. Select `finhealth`.
3. In settings:
   - Root Directory: `/backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In variables, add `CORS_ORIGINS=*`.
5. Under Networking, click **Generate Domain**.

---

## 4. Deploying the Frontend on Vercel

Vercel provides instant edge deployment, automated SSL certificates, and zero cold starts for Vite React applications.

### Step 4.1: Import Project to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository `finhealth`.

### Step 4.2: Configure Build Settings
* **Framework Preset**: `Vite`
* **Root Directory**: Click `Edit` and select `frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

### Step 4.3: Configure Environment Variables
Expand **Environment Variables** and add:
| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://finhealth-api.onrender.com` (Your live Render backend URL without trailing slash) |

### Step 4.4: Deploy
1. Click **Deploy**. Vercel will install dependencies and compile the production build in ~30 seconds.
2. You will receive a public production URL (e.g., `https://finhealth.vercel.app`).
3. Open the URL and test:
   - Click **Try Demo** to see the 6-month statement analysis load instantly.
   - Drag and drop `sample_data/sample_bank_statement.csv` or any real statement.
   - Click **Download / Print Report** to verify PDF generation.

---

## 5. Alternative Frontend: Deploying on Netlify

1. Log into [Netlify](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Set Base directory: `frontend`.
4. Build command: `npm run build`.
5. Publish directory: `frontend/dist`.
6. Add build environment variable `VITE_API_URL` pointing to your backend URL.
7. Click **Deploy Site**.

---

## 6. Privacy & Production Checklist

- [x] **Zero Disk Persistence**: All statement uploads are parsed in memory using Python `BytesIO` buffers and discarded.
- [x] **PII Masking**: Account numbers, phone numbers, and UPI VPA IDs are masked in responses (`XXXX-XXXX-4589`).
- [x] **CORS Whitelist**: Ensure production backend environment variable `CORS_ORIGINS` includes your live Vercel domain.
- [x] **HTTPS Only**: Both Render and Vercel automatically provision and enforce TLS/HTTPS certificates.
- [x] **Legal Disclaimer**: The UI includes a prominent notice that FinHealth provides budgeting insights and does not constitute certified financial advice.
