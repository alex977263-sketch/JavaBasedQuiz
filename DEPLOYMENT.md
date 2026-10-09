# GitHub Deployment Guide

This repository is pre-configured with automated CI/CD workflows, Dockerfiles, and production build pipelines. Follow the steps below to push this project to GitHub and deploy it.

---

## 🚀 1. Push This Project to GitHub

### Step A: Initialize Local Git Repository (if not already done)
Open your terminal in the project directory:

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "Initial commit: Java Online Quiz Platform"

# 4. Set main branch
git branch -M main
```

### Step B: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Choose a repository name (e.g., `java-quiz-platform`).
3. Leave it **Public** (or **Private**).
4. Do **not** initialize with README/gitignore (you already have them).
5. Click **Create repository**.

### Step C: Link and Push
Run the commands shown on GitHub:

```bash
# Replace YOUR_USERNAME and YOUR_REPO with your GitHub details
git remote add origin https://github.com/YOUR_USERNAME/java-quiz-platform.git

# Push code to GitHub
git push -u origin main
```

---

## 🌐 2. Deploy to GitHub Pages (Free & Automatic)

This repository includes `.github/workflows/deploy-pages.yml` which deploys the app automatically on every push!

1. In your GitHub repository, click **Settings** (top navigation).
2. On the left sidebar, click **Pages** (under "Code and automation").
3. Under **Build and deployment**:
   - Set **Source** to: `GitHub Actions`.
4. Trigger the deployment:
   - Click the **Actions** tab in your repository.
   - You will see the **Deploy to GitHub Pages** workflow running.
5. Once completed (~1 minute), your live URL will appear under the Pages tab:
   `https://YOUR_USERNAME.github.io/java-quiz-platform/`

> **Note for custom subpath on GitHub Pages**: If your repo is named `java-quiz-platform`, make sure `base: '/java-quiz-platform/'` is set in `vite.config.ts` if hosting on a subpath, or leave as `'./'` for relative assets.

---

## ⚡ 3. Deploy to Vercel (1-Click from GitHub)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your `java-quiz-platform` GitHub repository and click **Import**.
4. Vercel automatically detects **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.
6. In ~30 seconds, your site will be live with an SSL URL (e.g., `https://java-quiz-platform.vercel.app`).

---

## 🌲 4. Deploy to Netlify from GitHub

1. Go to [netlify.com](https://netlify.com) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and choose your repository.
4. Settings:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**.

---

## 🐳 5. Full-Stack Docker Deployment (Frontend + Spring Boot + MySQL)

For running the full stack on any server or VPS (AWS EC2, DigitalOcean, Linode, Hetzner, etc.):

```bash
# Clone your GitHub repository on your server
git clone https://github.com/YOUR_USERNAME/java-quiz-platform.git
cd java-quiz-platform

# Launch MySQL, Spring Boot Backend, and Frontend containers
docker compose up -d --build
```

- **Frontend:** `http://your-server-ip`
- **Backend API:** `http://your-server-ip:8080/api/v1`
- **MySQL:** Internal network port `3306`

---

## 🛠 6. Automated GitHub Actions Workflows Included

| Workflow File | Trigger | Description |
| :--- | :--- | :--- |
| `.github/workflows/deploy-pages.yml` | Push to `main` | Builds the Vite application and deploys to GitHub Pages |
| `.github/workflows/backend-ci.yml` | Push to `main` (backend code) | Compiles Java 17, runs Maven tests, and produces Spring Boot JAR artifacts |
