# 🚀 Open-Lovable - AI-Powered Website Cloning Tool

![Open-Lovable Banner](https://open-lovable-nine.vercel.app/banner.png)

## 📖 Overview

Open-Lovable is an AI-powered tool that can clone and recreate any website as a modern React application in seconds. Using advanced AI models and web scraping technology, it analyzes existing websites and generates clean, modern React code.

## ✨ Features

### 🎯 Core Capabilities
- **Website Cloning**: Clone any website into React components
- **AI-Powered Code Generation**: Multiple AI models for optimal results
- **Live Preview**: Real-time code execution and preview
- **Export Functionality**: Download or push to GitHub
- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS

### 🤖 AI Models Supported
- **AvalAI Platform**: 40+ premium models including GPT-5, Claude 4, O3 Pro
- **Google AI**: Gemini Pro, Gemini 1.5 Flash (Free)
- **Specialized Models**: DeepSeek Coder, Computer Use Preview
- **Smart Fallback**: Automatically switches between free and premium models

### 🛠️ Technologies Used
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **AI Integration**: OpenAI-compatible APIs, Google AI
- **Sandboxing**: E2B for secure code execution
- **Web Scraping**: Firecrawl for website analysis
- **Deployment**: Vercel, automatic CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/aminchedo/open-lovable.git
cd open-lovable
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:

```env
# Required APIs
E2B_API_KEY=your_e2b_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key

# AI Providers (at least one required)
AVALAI_API_KEY=your_avalai_api_key
AVALAI_BASE_URL=https://api.avalai.ir/v1
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Optional
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# App Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### E2B (Sandboxing)
1. Visit [e2b.dev](https://e2b.dev)
2. Sign up and create an API key
3. Free tier: 100 hours/month

### Firecrawl (Web Scraping)
1. Visit [firecrawl.dev](https://firecrawl.dev)
2. Sign up and get your API key
3. Free tier: 500 requests/month

### AvalAI (Premium AI Models)
1. Visit [avalai.ir](https://avalai.ir)
2. Sign up with phone/email
3. Access 40+ AI models including GPT-5, Claude 4
4. Payment in Iranian Rial

### Google AI (Free Models)
1. Visit [Google AI Studio](https://makersuite.google.com)
2. Get free API key for Gemini models
3. No payment required

## 📱 Usage

### Basic Website Cloning

1. **Enter a URL**: Input any website URL you want to clone
2. **Select AI Model**: Choose from available models (free or premium)
3. **Start Cloning**: AI analyzes and recreates the website
4. **Customize**: Chat with AI to modify the generated code
5. **Export**: Download code or push to GitHub

### Advanced Features

#### Custom Prompts
```
"Clone this website but make it about AI tutoring services"
"Keep the layout but change all content to match my restaurant business"
"Add a contact form and pricing section"
"Make it mobile-responsive with dark mode"
```

#### Model Selection
- **For Speed**: Gemini 1.5 Flash, GPT-4o Mini
- **For Quality**: GPT-5, Claude 4.1 Opus
- **For Coding**: DeepSeek Coder, Qwen3 Coder Plus
- **For Complex Tasks**: O3 Pro, Claude 4 Sonnet

## 🏗️ Project Structure

```
open-lovable/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── page.tsx          # Main page
├── components/            # Shared components
│   └── ui/               # UI components
├── config/               # Configuration files
├── docs/                 # Documentation
├── public/               # Static files
├── types/                # TypeScript definitions
├── .env.local           # Environment variables
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Vercel Deployment

The project is optimized for Vercel deployment:

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install", 
  "framework": "nextjs"
}
```

### Environment Variables in Production

Set these in your Vercel dashboard:
- `E2B_API_KEY`
- `FIRECRAWL_API_KEY`
- `AVALAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Build Errors:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**API Errors:**
- Check your API keys in `.env.local`
- Verify API key formats and permissions
- Check rate limits and quotas

**Deployment Issues:**
- Ensure all environment variables are set in Vercel
- Check build logs for specific errors
- Verify Node.js version compatibility

### Getting Help

- 📧 Email: support@openlovable.com
- 💬 Discord: [Join our community](https://discord.gg/openlovable)
- 🐛 Issues: [GitHub Issues](https://github.com/aminchedo/open-lovable/issues)
- 📖 Docs: [Full Documentation](https://docs.openlovable.com)

## 🌟 Acknowledgments

- [E2B](https://e2b.dev) for sandboxing technology
- [Firecrawl](https://firecrawl.dev) for web scraping capabilities
- [AvalAI](https://avalai.ir) for premium AI model access
- [Vercel](https://vercel.com) for hosting and deployment
- The open-source community for amazing tools and libraries

---

**Built with ❤️ by the Open-Lovable team**

[🌐 Live Demo](https://open-lovable-nine.vercel.app) | [📚 Documentation](https://docs.openlovable.com) | [💬 Community](https://discord.gg/openlovable)

## Troubleshooting

- Missing or invalid keys will now return 401 from API routes with clear messages.
- Validate your environment quickly:

```bash
curl -sS "$NEXT_PUBLIC_APP_URL/api/debug" | jq
```

- Required keys:
  - E2B_API_KEY must start with `e2b_`
  - FIRECRAWL_API_KEY must be present for scraping endpoints

If you still see 401s:
- Recheck the values in your deployment provider’s environment settings.
- Redeploy or restart the dev server after setting keys.
- The browser console may show: "[createSandbox] Error: 401 Invalid API key"; this now maps to a 401 response from `/api/create-ai-sandbox`.