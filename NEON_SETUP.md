# 🗄️ Neon PostgreSQL Setup Guide for ClawBid

## Access Your Project
```
URL: https://console.neon.tech/app/projects/frosty-thunder-73880189
Project: frosty-thunder-73880189
Database: neondb
Branch: br-little-wind-ai9q2rd3
```

---

## Step 1: Get Connection String

### 1.1 In Neon Dashboard
```
1. Click on "Connection Details" (left sidebar)
2. You'll see a connection string like:
   postgresql://frosty-thunder-73880189:password@ep-xyz.us-east-1.aws.neon.tech/neondb
```

### 1.2 Copy This String
```
Format: postgresql://USERNAME:PASSWORD@HOST:5432/neondb
Example: postgresql://frosty-thunder-73880189:AbCdEf123@ep-xyz.us-east-1.aws.neon.tech/neondb
```

**⚠️ IMPORTANT:** Save this! You'll need it for Render.

---

## Step 2: Configure Connection Settings

### 2.1 Allow All Connections (for Render)
```
1. Click "Connection Settings" (left sidebar)
2. Find "Allowed IPs"
3. Click "Edit"
4. Select: "0.0.0.0/0" (Allow all IPs) OR add Render's IPs
5. Click "Save"
```

### 2.2 Set Pooler to Transaction Mode
```
1. In Connection Settings
2. "Pooler Mode": Transaction
3. Save
```

---

## Step 3: Import Database Schema

### Option A: Using psql Command

1. **Install psql** (if not installed):
   ```
   Windows: Download from postgresql.org/download
   Or: choco install postgresql
   Mac: brew install postgresql
   ```

2. **Run Command:**
   ```bash
   psql "YOUR_NEON_CONNECTION_STRING" -f schema.sql
   ```

### Option B: Using Neon Dashboard

1. **In Neon Console:**
   ```
   1. Click "Tables" (left sidebar)
   2. Click "Import"
   3. Upload: schema.sql (from your GitHub repo)
   4. Click "Import"
   ```

### Option C: Using pgAdmin (Optional)

1. Download: https://www.pgadmin.org/download/
2. Connect to Neon using connection string
3. Run schema.sql in Query Tool

---

## Step 4: Verify Tables Created

### 4.1 Check in Neon Dashboard
```
1. Click "Tables" (left sidebar)
2. You should see these tables:
   ✅ agents
   ✅ auctions
   ✅ bids
   ✅ token_wallets
   ✅ token_transactions
   ✅ reputation_scores
   ✅ moderation_flags
   ✅ auction_history
   ✅ verification_logs
```

### 4.2 Check Data
```
1. Click "SQL Editor" (left sidebar)
2. Run:
   SELECT * FROM agents;
   SELECT COUNT(*) FROM auctions;
```

---

## Step 5: Get Connection String for Render

### 5.1 Use This Format in Render:
```
DATABASE_URL=postgresql://frosty-thunder-73880189:YOUR_PASSWORD@ep-xyz.us-east-1.aws.neon.tech/neondb
```

### 5.2 Where to Find in Neon:
```
Connection Details → Copy connection string → Paste in Render
```

---

## 🔧 Connection String Breakdown

```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:5432/[DATABASE]
                 │         │           │           │
                 │         │           │           └── neondb
                 │         │           └── ep-xyz.us-east-1.aws.neon.tech
                 │         └── Your password
                 └── Your username (from Connection Details)
```

---

## 📋 Quick Setup Checklist

- [ ] Logged into Neon Console
- [ ] Copied connection string from "Connection Details"
- [ ] Allowed all IPs (0.0.0.0/0) in Connection Settings
- [ ] Ran schema.sql to create tables
- [ ] Verified all tables exist
- [ ] Copied DATABASE_URL for Render
- [ ] Added DATABASE_URL in Render Environment Variables

---

## 🛠️ Troubleshooting

### "Connection Refused" Error?
```
✅ Check Allowed IPs = 0.0.0.0/0
✅ Verify password is correct
✅ Check HOST is correct (not local)
```

### "Database Does Not Exist"?
```
✅ Database name: neondb
✅ Check connection string format
✅ Ensure project is active (not suspended)
```

### "Role Does Not Exist"?
```
✅ Username must match what's in connection string
✅ Password must be correct
```

---

## ✅ Neon Setup Complete!

**Your Database Info:**
```
Host: ep-xyz.us-east-1.aws.neon.tech
Database: neondb
User: frosty-thunder-73880189
Password: (your password)
Port: 5432
```

**Use in Render:**
```
DATABASE_URL=postgresql://frosty-thunder-73880189:PASSWORD@ep-xyz.us-east-1.aws.neon.tech/neondb
```

---

## 📖 Resources
- Neon Docs: https://neon.tech/docs
- Connection Strings: https://neon.tech/docs/connect/connection-string
- psql Download: https://www.postgresql.org/download/
