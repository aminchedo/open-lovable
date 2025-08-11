# 🔧 Vercel Deployment Troubleshooting

## Current Status: ❌ Failed Deployment

### Latest Fixes Applied:
- ✅ Fixed OpenAI dependency conflicts (v5 → v4)
- ✅ Updated build configuration with `--legacy-peer-deps`
- ✅ Enhanced Vercel configuration
- ✅ Added Node.js 20 compatibility
- ✅ Optimized Next.js 15 configuration

---

## 🚨 **Immediate Actions Required**

### 1. Update Environment Variables in Vercel Dashboard
Go to: **Vercel Dashboard → Project Settings → Environment Variables**

**Add these variables (replace with actual values):**
```bash
# REQUIRED - Core Services
E2B_API_KEY=e2b_your_actual_key_here
FIRECRAWL_API_KEY=fc-your_actual_key_here

# REQUIRED - At least one AI provider
GOOGLE_GENERATIVE_AI_API_KEY=AIza_your_google_key_here

# RECOMMENDED - Premium AI providers
AVALAI_API_KEY=aa-your_avalai_key_here
AVALAI_BASE_URL=https://api.avalai.ir/v1

# OPTIONAL - Additional providers
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
OPENAI_API_KEY=sk-your_openai_key
GROQ_API_KEY=gsk_your_groq_key

# APP CONFIGURATION
NODE_ENV=production
SKIP_ENV_VALIDATION=true
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 2. Verify Build Settings in Vercel
**Project Settings → Build & Development Settings:**
- ✅ Framework: `Next.js`
- ✅ Build Command: `npm ci --legacy-peer-deps && npm run build`
- ✅ Install Command: `npm ci --legacy-peer-deps`
- ✅ Output Directory: `.next`
- ✅ Node.js Version: `20.x`

### 3. Force Redeploy
After setting environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"** = `false`

---

## 🔍 **Common Deployment Failures & Solutions**

### Issue 1: Dependency Resolution Errors
**Symptoms:** `ERESOLVE could not resolve` errors
**Solution:**
```bash
# Local testing
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Issue 2: Environment Variable Errors
**Symptoms:** `Missing required environment variables`
**Solution:**
- Verify all variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure API keys have correct prefixes

### Issue 3: Build Timeout
**Symptoms:** Build exceeds time limits
**Solution:**
- Increase function timeout in `vercel.json`
- Optimize dependencies and imports

### Issue 4: Memory Issues
**Symptoms:** `Process killed` or memory errors
**Solution:**
- Increase memory allocation in `vercel.json`
- Use external packages configuration

---

## 🧪 **Testing Checklist**

### Before Deployment:
- [ ] `npm install --legacy-peer-deps` works
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] All required environment variables are set

### After Deployment:
- [ ] Visit `/` - homepage loads
- [ ] Visit `/test` - API test page works
- [ ] Visit `/api/debug` - shows environment status
- [ ] Test core functionality

---

## 🚀 **Deployment Workflow**

### Step 1: Prepare Local Environment
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps

# Test build
npm run build
npm run dev
```

### Step 2: Configure Vercel
1. Set all environment variables
2. Verify build settings
3. Check Node.js version (20.x)

### Step 3: Deploy
1. Push changes to GitHub
2. Monitor Vercel build logs
3. Test deployment at provided URL

### Step 4: Verify
1. Check all API endpoints work
2. Test core functionality
3. Monitor error logs

---

## 📞 **Get Help**

### Check Build Logs:
1. Vercel Dashboard → Deployments
2. Click on failed deployment
3. View **Build Logs** and **Function Logs**

### Test API Status:
- Visit: `https://your-app.vercel.app/api/debug`
- Should show all environment variables status

### Common Log Patterns:
- `Module not found` → Check imports and dependencies
- `Environment variable not set` → Check Vercel dashboard
- `Build timeout` → Optimize build configuration
- `Memory limit exceeded` → Increase memory allocation

---

## 🎯 **Expected Result**

After following this guide:
- ✅ Vercel deployment succeeds
- ✅ Homepage loads correctly
- ✅ API endpoints respond
- ✅ Test dashboard works at `/test`
- ✅ No build errors or warnings