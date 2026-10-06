# 🚀 Deploying to Vercel Guide

The **Veritas University College Student Management System** is completely pre-configured for **Zero-Config instant deployment** on [Vercel](https://vercel.com).

---

## ⚡ Method 1: Deploy via GitHub (Recommended & Free)

1. **Initialize Git & Push to GitHub**:
   In your terminal or command prompt inside this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Veritas University CSMS"
   git branch -M main
   # Add your remote repository:
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** → **"Project"**.
   - Select your GitHub repository (`<your-repo-name>`).
   - Leave the Framework Preset as **"Other"** (Vercel will automatically detect `vercel.json` and `index.html`).
   - Click **"Deploy"**.

Your application will be live worldwide in seconds at a custom `https://<your-project>.vercel.app` URL!

---

## 💻 Method 2: Deploy using Vercel CLI

If you have Node/npm or Vercel CLI installed:
```bash
# Login to your Vercel account
npx vercel login

# Deploy directly from this directory
npx vercel

# To deploy directly to production
npx vercel --prod
```

Follow the interactive prompts:
- Set up and deploy? **Y**
- Which scope? *(select your team/personal account)*
- Link to existing project? **N**
- Project name: `veritas-csms` (or any name you choose)
- In which directory is your code located? `./`
- Want to modify settings? **N**

---

## 📂 Pre-Configured Vercel Files

- **`vercel.json`**:
  - `cleanUrls: true` (clean semantic URLs)
  - Security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`)
  - Correct cache revalidation and CORS headers for scripts and styles
  - Single-Page-Application (SPA) route fallback to `index.html`
- **`package.json`**: Contains project metadata, script commands, and keywords
- **`.gitignore`**: Excludes `.vercel`, `node_modules`, environment variables, and local OS files
