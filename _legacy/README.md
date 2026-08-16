# Trailo Web App — Netlify & Subdomain Deployment Guide 🚀

This repository contains the official two-page web application for **Trailo**, an Automated Trips, Trials & Treks Agentic Product under **Girivah**.

## Project Architecture
The project is architected as a clean, high-performance static web application designed according to Girivah's Master Brand UX System (Slate Fjord `#2E3A46`, Alpine Ember `#D97732`, and Apple/Linear minimalist telemetry design).

### File Directory Structure:
```
trailo/
├── index.html               # Main Trailo Agentic Landing Page & Live Interactive Demo
├── privacy-policy.html      # Privacy & Data Trust Policy (/privacy-policy)
├── privacy-policy/          # Clean URL fallback directory
│   └── index.html
├── styles.css               # Vanilla CSS utilizing Girivah design tokens & glassmorphism
├── script.js                # Interactive AI Agent demo simulation & lead form logic
├── netlify.toml             # Pre-configured routing, security headers & cache optimization
└── assets/                  # High-resolution hero & AI telemetry interface images
```

---

## Part 1: How to Deploy to Netlify (Two Easy Methods)

### Method A: Instant Drag-and-Drop (Netlify Drop - Takes 10 seconds)
1. Log in to your Netlify account at [app.netlify.com](https://app.netlify.com/).
2. On your main team dashboard, click on **Add new site** -> **Deploy manually** (or go to [app.netlify.com/drop](https://app.netlify.com/drop)).
3. Open your file explorer, locate the folder `e:\Sunny React Projects\girivah\trailo`, and simply **drag and drop the entire `trailo` folder** into the Netlify drop zone!
4. Your site will instantly publish! Netlify will assign a random temporary domain name (e.g., `magical-alpine-trailo-123456.netlify.app`).

### Method B: Git / GitHub Deployment (Recommended for ongoing updates)
1. Push this `trailo` folder (or your whole repository) to GitHub, GitLab, or Bitbucket.
2. In Netlify, click **Add new site** -> **Import an existing project**.
3. Connect your repository.
4. **Build Settings**:
   - **Base directory**: `trailo` (if it's inside your bigger `girivah` monorepo) or leave empty if `trailo` is its own repo.
   - **Build command**: Leave completely **blank / empty** (no compile steps required for pure static HTML/CSS/JS!).
   - **Publish directory**: `.` (or `trailo`).
5. Click **Deploy Site**.

---

## Part 2: How to Connect Your Custom Subdomain on Netlify

Once your site is deployed on Netlify, here is exactly how to attach your created subdomain (e.g., `trailo.girivah.com`):

### Step 1: Add the Subdomain in Netlify
1. In Netlify, click on your newly deployed site to open its overview dashboard.
2. Go to **Site Configuration** (or **Domain Management**) -> **Domain management**.
3. Click the button **Add custom domain**.
4. Enter your full subdomain name (for example: `trailo.girivah.com` or whatever subdomain you created).
5. Click **Verify** and then click **Add domain**.

### Step 2: Configure DNS Records in Your Domain Provider
Now you need to point your subdomain from your domain registrar (GoDaddy, Namecheap, Cloudflare, AWS Route53, Hostinger, BigRock, etc.) to Netlify:

*If you manage your DNS manually in Cloudflare, GoDaddy, Namecheap, or Hostinger:*
1. Log in to your domain registrar where `girivah.com` (or your root domain) is registered.
2. Go to the **DNS Management / DNS Records / Zone Editor** page.
3. Click **Add New Record** with the following details:
   - **Record Type**: `CNAME`
   - **Name / Host / Subdomain**: `trailo` (if your subdomain is `trailo.girivah.com`)
   - **Target / Value / Points To**: Your Netlify temporary site address (e.g., `your-site-name.netlify.app`). **Do not include https://** in the CNAME value.
   - **TTL**: Auto / Standard / 3600
4. Save the record.

*(Note: If you are using Cloudflare, you can turn Proxy Status to "DNS Only" (Grey Cloud) initially so Netlify can quickly verify and issue the automatic SSL certificate).*

### Step 3: Verify Automatic HTTPS (Free SSL Certificate)
1. Go back to Netlify -> **Domain Management** -> **HTTPS / SSL**.
2. Within 5 to 30 minutes after your DNS propagates, Netlify will automatically generate a free Let's Encrypt HTTPS SSL certificate for your subdomain.
3. Once issued, make sure **Force HTTPS** is checked/turned ON so all visitors visiting `http://trailo.girivah.com` are securely redirected to `https://`.

---

## Verification & Clean Routing Check
Once live on your custom subdomain:
- Visiting `https://trailo.girivah.com/` will serve the interactive Trailo AI Agent home page.
- Visiting `https://trailo.girivah.com/privacy-policy` will cleanly load the Trust & Privacy Policy page without requiring `.html` in the URL!

🎉 **You are now live with Trailo under Girivah!**
