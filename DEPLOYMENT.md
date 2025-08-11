# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] `E2B_API_KEY` - Required for sandboxing
- [ ] `FIRECRAWL_API_KEY` - Required for web scraping
- [ ] At least one AI provider key:
  - [ ] `AVALAI_API_KEY` (Premium models)
  - [ ] `GOOGLE_GENERATIVE_AI_API_KEY` (Free models)
  - [ ] `ANTHROPIC_API_KEY` (Claude models)
  - [ ] `OPENAI_API_KEY` (GPT models)
  - [ ] `GROQ_API_KEY` (Fast inference)

### ✅ Build Verification
- [ ] `npm install` - Dependencies installed
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run build` - Build successful
- [ ] `npm run start` - Application starts correctly

### ✅ Vercel Configuration
- [ ] `vercel.json` properly configured
- [ ] Environment variables set in Vercel dashboard
- [ ] Build command: `npm run build`
- [ ] Install command: `npm install`
- [ ] Framework: `nextjs`

## Common Deployment Issues

### Build Failures
```bash
# Clean rebuild
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Environment Variable Issues
- Check variable names match exactly
- Ensure all required variables are set
- Verify API key formats and permissions

### API Integration Issues
- Test API endpoints locally first
- Check rate limits and quotas
- Verify API key permissions

## Production Environment Variables

Set these in your Vercel dashboard:

```env
# Required
E2B_API_KEY=your_e2b_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key

# AI Providers (at least one)
AVALAI_API_KEY=your_avalai_api_key
AVALAI_BASE_URL=https://api.avalai.ir/v1
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Optional
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key

# App Configuration
NODE_ENV=production
```

## Monitoring

### Build Logs
- Check Vercel build logs for errors
- Monitor function execution times
- Verify all API routes are working

### Performance
- Monitor bundle sizes
- Check API response times
- Verify sandbox creation and management

## Troubleshooting

### Build Errors
1. Check Node.js version compatibility
2. Verify all dependencies are installed
3. Check for TypeScript/ESLint errors
4. Ensure proper Next.js configuration

### Runtime Errors
1. Check environment variables
2. Verify API key permissions
3. Monitor API rate limits
4. Check sandbox status and logs

### Performance Issues
1. Optimize bundle size
2. Check API response times
3. Monitor memory usage
4. Verify caching strategies

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs
- Test locally first
- Contact support if needed