# 🚀 Vercel Deployment Guide

## Quick Fix for Current Deployment Issues

### 1. Environment Variables Setup
Go to your Vercel dashboard → Project Settings → Environment Variables and add these **required** variables:

```bash
# Required for core functionality
E2B_API_KEY=your_e2b_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# At least one AI provider (choose one or more)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here  # Free option
AVALAI_API_KEY=your_avalai_api_key_here               # Premium models
ANTHROPIC_API_KEY=your_anthropic_key_here             # Optional
OPENAI_API_KEY=your_openai_key_here                   # Optional
GROQ_API_KEY=your_groq_key_here                       # Optional

# App configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 2. Build Configuration
The project now includes these fixes:
- ✅ Fixed OpenAI dependency conflicts (downgraded to v4.x)
- ✅ Updated `vercel.json` with proper build commands
- ✅ Added `--legacy-peer-deps` installation flag
- ✅ Build verification completed successfully

### 3. Deploy Steps
1. **Fork/Clone** this repository
2. **Import** to Vercel from GitHub
3. **Set Environment Variables** (see above)
4. **Deploy** - should work automatically

## 🔧 Getting API Keys

### E2B (Required for Sandboxing)
1. Visit [https://e2b.dev/dashboard?tab=keys](https://e2b.dev/dashboard?tab=keys)
2. Sign up/Login
3. Create new API key
4. Key format: `e2b_xxxxxxxx`

### Firecrawl (Required for Web Scraping)
1. Visit [https://firecrawl.dev/](https://firecrawl.dev/)
2. Sign up/Login
3. Get API key from dashboard
4. Key format: `fc-xxxxxxxx`

### Google AI (Free Option)
1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create API key
3. Key format: `AIzaxxxxxxxx`

### AvalAI (Premium Models)
1. Visit [https://avalai.ir/](https://avalai.ir/)
2. Sign up and get API key
3. Key format: `aa-xxxxxxxx`

## 🧪 Testing Deployment
After deployment, visit `/test` to verify all APIs work correctly.

## 🚨 Common Issues & Fixes

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### API Errors
- Check environment variables are set correctly
- Verify API key formats match expected patterns
- Test APIs individually at `/api/debug`

### Memory Issues
- API functions are configured with 1GB memory
- Increase if needed in `vercel.json`

## 📞 Support
If deployment still fails:
1. Check Vercel build logs
2. Test locally with `npm run build`
3. Verify all environment variables are set
4. Check API key validity at `/api/debug`