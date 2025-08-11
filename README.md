# 🚀 Open-Lovable - Premium AI-Powered Website Builder

**Transform your ideas into beautiful, functional websites with access to 40+ premium AI models including GPT-5, Claude 4, O3 Pro, and more!**

## ✨ **NEW: Premium AvalAI Integration**

Open-Lovable now features **premium access to 40+ cutting-edge AI models** through AvalAI, giving you access to the latest and most advanced AI capabilities:

### 🔥 **Latest & Most Advanced Models**
- **🚀 GPT-5 (Latest)** - OpenAI's newest and most powerful model
- **⚡ GPT-5 Mini (Fast)** - Optimized for speed and efficiency
- **🧠 O3 Pro (Reasoning)** - Advanced reasoning and problem-solving
- **🎭 Claude 4.1 Opus (Latest)** - Anthropic's most creative model

### 💻 **Specialized Coding Models**
- **💻 DeepSeek Coder** - Specialized for code generation
- **💻 Qwen3 Coder Plus** - Advanced coding capabilities
- **💻 Codestral 2501** - Professional-grade coding
- **💻 Computer Use (Preview)** - Multimodal interaction

### ⚡ **Fast & Efficient Models**
- **⚡ Grok-3 Fast (Beta)** - xAI's fastest model
- **💎 Gemini 2.5 Flash Lite** - Google's latest fast model
- **🎯 Groq-4 (Fast)** - Ultra-fast inference

### 🎭 **Creative & Writing Models**
- **🎭 Claude 3.7 Sonnet** - Creative writing excellence
- **💎 Gemini 2.0 Pro (Experimental)** - Advanced creativity

## 🎯 **Smart Model Recommendations**

The AI automatically suggests the best model for your task:
- **Website Cloning**: GPT-5 Mini for fast, accurate cloning
- **Code Generation**: DeepSeek Coder for specialized coding
- **Creative Tasks**: Claude 4.1 Opus for creative modifications
- **Complex Reasoning**: O3 Pro for advanced logic
- **Fast Responses**: Grok-3 Fast for quick results

## 🚀 **Quick Start**

### 1. **Setup Environment**
```bash
# Clone the repository
git clone <repository-url>
cd open-lovable

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
```

### 2. **Configure Premium AI Access**
Update `.env.local` with your API keys:

```env
# Working APIs (included)
E2B_API_KEY=e2b_de5e30a8e0268b3e33743541accd3adda298b530
FIRECRAWL_API_KEY=fc-192ea47f3e7f4913bb7f61588bcad7ba

# AvalAI - Premium AI Models (included)
AVALAI_API_KEY=aa-4jpbPW57MrwaTTMFJMqflwJC68cO2i3VeJvK7UG5Gsl6mWy4
AVALAI_BASE_URL=https://api.avalai.ir/v1

# Optional: Other AI providers
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD_m8hatVazgotDmr83YPMahWPp5sX7nds
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GROQ_API_KEY=

# App Settings
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to start building!

## 🎨 **Features**

### **AI-Powered Website Generation**
- **40+ Premium AI Models** - Access to GPT-5, Claude 4, O3 Pro, and more
- **Smart Model Selection** - AI recommends the best model for your task
- **Real-time Code Generation** - Watch your website come to life
- **Live Preview** - See changes instantly in the browser

### **Advanced Capabilities**
- **Website Cloning** - Clone any website with AI analysis
- **Code Editing** - Intelligent code modifications and improvements
- **Package Management** - Automatic dependency detection and installation
- **Error Handling** - Smart error detection and resolution

### **Developer Experience**
- **Vite Development Server** - Fast hot reloading
- **File Explorer** - Browse and edit generated files
- **Chat Interface** - Natural language interaction with AI
- **Download Support** - Export your project as ZIP

## 🏗️ **Architecture**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### **Backend**
- **AvalAI Integration** - 40+ premium AI models
- **E2B Sandbox** - Secure code execution environment
- **Firecrawl** - Website scraping and analysis
- **Vite** - Fast development server

### **AI Models Available**
```javascript
// Premium Models (40+ total)
const premiumModels = [
  'avalai/gpt-5',                    // Latest GPT-5
  'avalai/gpt-5-mini',              // Fast GPT-5
  'avalai/o3-pro',                  // Advanced reasoning
  'avalai/anthropic.claude-opus-4-1-20250805-v1.0', // Latest Claude
  'avalai/deepseek-coder',          // Specialized coding
  'avalai/grok-4',                  // xAI's latest
  'avalai/gemini-2.5-flash-lite',   // Google's fastest
  // ... and 30+ more models
];
```

## 🎯 **Use Cases**

### **Website Development**
- **Landing Pages** - Create stunning landing pages in minutes
- **Portfolio Sites** - Professional portfolios with AI design
- **E-commerce** - Shopping sites with modern UI/UX
- **Blogs** - Content-focused websites with SEO optimization

### **Code Generation**
- **React Components** - Reusable, modern components
- **API Integration** - Backend services and data handling
- **Styling** - CSS, Tailwind, and custom designs
- **Animations** - Smooth, engaging user interactions

### **Website Cloning**
- **Design Analysis** - AI-powered design understanding
- **Code Extraction** - Intelligent code generation
- **Responsive Design** - Mobile-first approach
- **Performance Optimization** - Fast, efficient code

## 🔧 **Configuration**

### **Model Selection**
Choose from categorized models:
- **🚀 Latest & Most Advanced** - GPT-5, O3 Pro, Claude 4.1
- **⚡ Fast & Efficient** - GPT-5 Mini, Grok-3 Fast
- **💻 Specialized Coding** - DeepSeek Coder, Qwen3 Coder Plus
- **🎭 Creative & Writing** - Claude 3.7 Sonnet, Gemini 2.0 Pro
- **🧠 Advanced Reasoning** - O3 Pro, O3, O1 Pro
- **🎯 Fast Inference** - Groq-4, Groq-3, Grok-3 Mini
- **🔧 Utility & Tools** - Whisper-1, Text Embedding 3 Large

### **Smart Recommendations**
The AI analyzes your input and suggests the optimal model:
```javascript
const recommendations = {
  'website-cloning': 'avalai/gpt-5-mini',
  'code-generation': 'avalai/deepseek-coder',
  'creative-writing': 'avalai/anthropic.claude-opus-4-1-20250805-v1.0',
  'complex-reasoning': 'avalai/o3-pro',
  'fast-responses': 'avalai/grok-3-fast-beta'
};
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Other Platforms**
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 **Acknowledgments**

- **AvalAI** - Premium AI model access
- **E2B** - Secure sandbox environment
- **Firecrawl** - Website scraping capabilities
- **OpenAI** - GPT-5 and O3 models
- **Anthropic** - Claude models
- **Google** - Gemini models
- **xAI** - Grok models

---

**Transform your ideas into reality with the most advanced AI models available! 🚀**