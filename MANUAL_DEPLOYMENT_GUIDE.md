# 🚀 Manual Vercel Deployment Guide

## ⚠️ MANUAL SETUP REQUIRED

Since automatic Vercel login requires interactive verification, please follow these manual steps:

---

## Step 1: Vercel Login

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```
   - Choose your preferred login method (GitHub, Google, etc.)
   - Complete the authentication process

---

## Step 2: Environment Variables Setup

### Option A: Using Vercel CLI (Recommended)
```bash
# Run the environment setup script
node setup-vercel-env.js
```

### Option B: Manual Dashboard Setup
If CLI setup fails, manually configure in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project (or create new one)
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **ALL environments** (Production, Preview, Development):

```
E2B_API_KEY = E2b_59c8b95bd4c0b0cbb2aca709dee1adb38be2f7ea
FIRECRAWL_API_KEY = fc-192ea47f3e7f4913bb7f61588bcad7ba
AVALAI_API_KEY = aa-4jpbPW57MrwaTTMFJMqflwJC68cO2i3VeJvK7UG5Gsl6mWy4
AVALAI_BASE_URL = https://api.avalai.ir/v1
GOOGLE_GENERATIVE_AI_API_KEY = AIzaSyD_m8hatVazgotDmr83YPMahWPp5sX7nds
GROQ_API_KEY = gsk_placeholder_key_12345
NODE_ENV = production
```

---

## Step 3: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

**Expected Output:**
- Project configuration
- Build process
- Deployment URL: `https://[project-name].vercel.app`

---

## Step 4: Verify Deployment

After deployment, test the endpoints:

```bash
# Test debug endpoint
curl -s https://[your-project].vercel.app/api/debug

# Test E2B endpoint
curl -X POST https://[your-project].vercel.app/api/create-ai-sandbox \
  -H "Content-Type: application/json" \
  -d '{"template":"nodejs"}'

# Test Firecrawl endpoint
curl -X POST https://[your-project].vercel.app/api/scrape-screenshot \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## Step 5: Run Production Tests

```bash
# Run comprehensive production tests
node test-production.js https://[your-project].vercel.app

# Generate test report
node generate-test-report.js
```

---

## Current Status Analysis

### ✅ Local Development (Working)
- Environment variables: 5/6 configured
- Debug endpoint: ✅ Working
- Missing: GROQ_API_KEY (non-critical)

### ❌ Production Deployment (Needs Fix)
- Debug endpoint: ❌ 404 Error
- E2B Sandbox: ❌ 500 Error  
- Firecrawl: ❌ 500 Error
- AI Generation: ✅ Working

### 🔧 Issues to Address
1. **API Routes Not Found**: The `/api/debug` endpoint returns 404 in production
2. **Environment Variables**: May not be properly configured in production
3. **Build Configuration**: API routes might not be building correctly

---

## Troubleshooting

### If API Routes Return 404:
1. Check `vercel.json` configuration
2. Verify API routes are in `app/api/` directory
3. Ensure proper Next.js 13+ App Router structure

### If Endpoints Return 500:
1. Check environment variables in Vercel dashboard
2. Review server logs in Vercel dashboard
3. Verify API key formats and permissions

### If Build Fails:
1. Check `package.json` dependencies
2. Verify Node.js version compatibility
3. Review build logs in Vercel dashboard

---

## Success Criteria

After successful deployment, verify:
- ✅ All environment variables configured
- ✅ Debug endpoint returns 200 status
- ✅ E2B sandbox creation works
- ✅ Firecrawl screenshot works
- ✅ AI generation works
- ✅ Success rate > 90%

---

## Next Steps

1. Complete manual Vercel login
2. Configure environment variables
3. Deploy to production
4. Run verification tests
5. Monitor for any issues

**Target**: Achieve 90%+ success rate (currently at 25%)