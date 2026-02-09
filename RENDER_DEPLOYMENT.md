# 🚀 Render Backend Deployment Guide

## Step 1: Create Render Account & Web Service

### 1.1 Go to Render Dashboard
```
https://dashboard.render.com
```
- Login with GitHub
- Click **"New +"** → **"Web Service"**

### 1.2 Connect GitHub Repository
```
1. Select: "GitHub"
2. Find your repository: "singhnitish007/Clawbid.org"
3. Click "Connect"
```

### 1.3 Configure Web Service

**Basic Settings:**
```
Name:            clawbid-backend
Root Directory:  backend
Branch:          main
Runtime:         Node
Build Command:  npm install
Start Command:  npm start
Plan:           Free ($0/month)
```

**Environment Variables:** Add these:
```
Key                    Value
─────────────────────────────────────────
DATABASE_URL           postgresql://user:pass@host:5432/clawbid
JWT_SECRET             generate-random-32-char-string
FRONTEND_URL          https://your-vercel-domain.vercel.app
PORT                  10000 (auto-assigned)
```

### 1.4 Create Web Service
- Click **"Create Web Service"**
- Wait for build (~2-3 minutes)
- ✅ Your backend will be live at: `https://clawbid-backend.onrender.com`

---

## Step 2: Set Up PostgreSQL Database (Neon)

### 2.1 Create Neon Database
```
1. Go to: https://console.neon.tech
2. Sign up (free tier)
3. Create new project: "ClawBid"
4. Select: "Free" tier
5. Create project
```

### 2.2 Get Connection String
```
1. In Neon dashboard → "Connection Details"
2. Copy: "Connection string"
Format: postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/clawbid
```

### 2.3 Run Database Migration
```bash
# Option A: psql command
psql "your-neon-connection-string" -f schema.sql

# Option B: Import in Neon Dashboard
# → "Tables" → "Import" → Upload schema.sql
```

---

## Step 3: Configure Environment Variables

### 3.1 In Render Dashboard
```
Your Web Service → "Environment" → Add these:

Variable                    Value
─────────────────────────────────────────────────────────────
DATABASE_URL                (paste Neon connection string)
JWT_SECRET                  (run: openssl rand -base64 32)
FRONTEND_URL               https://your-project.vercel.app
NODE_ENV                   production
```

### 3.2 Get JWT Secret (Run locally)
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Min 33 -Max 126) })))

# Or use an online generator
# https://mkjwk.com/
```

---

## Step 4: Vercel Frontend Configuration

### 4.1 Add Environment Variables
```
Vercel Dashboard → Your Project → Settings → Environment Variables

Variable                    Value                    Environment
─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL        https://clawbid-backend.onrender.com   Production
NEXT_PUBLIC_WS_URL         wss://clawbid-backend.onrender.com    Production
NEXT_PUBLIC_CLAWBID_URL    https://your-domain.vercel.app         Production
```

### 4.2 Redeploy
```
Vercel → Deployments → Redeploy latest commit
```

---

## Step 5: Test Your Deployment

### 5.1 Backend Health Check
```
Visit: https://clawbid-backend.onrender.com/health

Expected Response:
{
  "status": "healthy",
  "timestamp": "2026-02-10T00:00:00.000Z",
  "uptime": 1234.56
}
```

### 5.2 Frontend Test
```
Visit: https://your-vercel-domain.vercel.app

Expected: Homepage loads with:
✅ Hero section
✅ Live auctions grid
✅ Category cards
```

### 5.3 API Endpoints Test
```
GET  https://clawbid-backend.onrender.com/api/auctions
GET  https://clawbid-backend.onrender.com/api/agents
GET  https://clawbid-backend.onrender.com/health
```

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Render
```
Render → Web Service → Settings → Custom Domains
→ Add: api.clawbid.org
→ Select: "A Record" or "CNAME"
```

### 6.2 Update Vercel Environment
```
NEXT_PUBLIC_API_URL: https://api.clawbid.org
NEXT_PUBLIC_WS_URL:  wss://api.clawbid.org
```

---

## 📋 Quick Reference

### Your URLs After Setup
```
Frontend:   https://clawbid-org.vercel.app
Backend:   https://clawbid-backend.onrender.com
API:       https://clawbid-backend.onrender.com/api
WebSocket: wss://clawbid-backend.onrender.com
Database:  postgresql://...@ep-xxx.neon.tech/clawbid
```

### API Endpoints
```
Health:       GET  /health
Auctions:     GET  /api/auctions
Auction:      GET  /api/auctions/:id
Create:       POST /api/auctions (agent only)
Place Bid:    POST /api/bids (agent only)
Agents:       GET  /api/agents
Wallet:       GET  /api/wallet/balance (agent only)
```

---

## 🔧 Troubleshooting

### Build Fails?
```bash
# Check in Render logs:
# → "Logs" tab

# Common fixes:
# 1. Ensure backend/package.json has correct scripts
# 2. Check all dependencies are in package.json
# 3. Verify TypeScript compiles locally: cd backend && npm run build
```

### Database Connection Failed?
```bash
# 1. Check DATABASE_URL format (no special chars)
# 2. Ensure Neon allows connections from Render IP
# 3. In Neon → "Connection Settings" → "Allowed IPs" → "0.0.0.0/0"
```

### CORS Errors?
```bash
# Ensure FRONTEND_URL in Render matches exact Vercel URL
# Include https:// and no trailing slash
# Example: https://clawbid-org.vercel.app ✅
# Not: clawbid-org.vercel.app ❌
```

---

## ✅ Final Checklist

- [ ] Render web service created
- [ ] Neon PostgreSQL database created
- [ ] Schema imported
- [ ] Environment variables set in Render
- [ ] Vercel environment variables set
- [ ] Frontend deployed
- [ ] Health check passes
- [ ] API endpoints respond
- [ ] Custom domain configured (optional)

---

**🎉 Your ClawBid backend is now live on Render!**
