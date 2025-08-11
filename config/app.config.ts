// Application Configuration
// This file contains all configurable settings for the application

export const appConfig = {
  // E2B Sandbox Configuration
  e2b: {
    // Sandbox timeout in minutes
    timeoutMinutes: 15,
    
    // Convert to milliseconds for E2B API
    get timeoutMs() {
      return this.timeoutMinutes * 60 * 1000;
    },
    
    // Vite development server port
    vitePort: 5173,
    
    // Time to wait for Vite to be ready (in milliseconds)
    viteStartupDelay: 7000,
    
    // Time to wait for CSS rebuild (in milliseconds)
    cssRebuildDelay: 2000,
    
    // Default sandbox template (if using templates)
    defaultTemplate: undefined, // or specify a template ID
  },
  
  // AI Model Configuration
  ai: {
    // Default AI model - Premium GPT-5 Mini for best balance
    defaultModel: 'avalai/gpt-5-mini',
    
    // Available models - 40+ Premium AvalAI Models
    availableModels: [
      // 🔥 Latest GPT-5 Models (Premium)
      'avalai/gpt-5',
      'avalai/gpt-5-mini',
      'avalai/gpt-5-2025-08-07',
      
      // 🧠 OpenAI O3 Series (Most Advanced)
      'avalai/o3-pro',
      'avalai/o3',
      'avalai/o3-2025-04-16',
      'avalai/o1-pro',
      'avalai/o1-mini',
      
      // 🎭 Claude 4 & 3.7 Series (Latest Anthropic)
      'avalai/anthropic.claude-opus-4-1-20250805-v1.0',
      'avalai/anthropic.claude-opus-4-20250514-v1.0',
      'avalai/anthropic.claude-sonnet-4-20250514-v1.0',
      'avalai/anthropic.claude-3-7-sonnet-20250219-v1.0',
      'avalai/anthropic.claude-3-5-sonnet-20241022-v2.0',
      
      // 💎 Google Gemini 2.5 & 2.0 Series
      'avalai/gemini-2.5-flash-lite',
      'avalai/gemini-2.0-pro-exp-02-05',
      'avalai/gemini-1.5-pro-latest',
      
      // 🚀 xAI Grok Series
      'avalai/grok-4',
      'avalai/grok-3-fast-beta',
      'avalai/grok-3-mini-beta',
      
      // 💻 Specialized Coding Models
      'avalai/deepseek-coder',
      'avalai/qwen3-coder-plus',
      'avalai/codestral-2501',
      'avalai/computer-use-preview-2025-03-11',
      
      // 🎯 Groq Models (Fast Inference)
      'avalai/groq-4-0709',
      'avalai/groq-3',
      
      // 🔧 Utility Models
      'avalai/gpt-4-turbo-2024-04-09',
      'avalai/whisper-1',
      'avalai/text-embedding-3-large',
      
      // Legacy Models (Fallback)
      'google/gemini-pro',
      'google/gemini-1.5-flash',
      'openai/gpt-5',
      'moonshotai/kimi-k2-instruct',
      'anthropic/claude-sonnet-4-20250514'
    ],
    
    // Model display names with tier indicators
    modelDisplayNames: {
      // 🔥 Latest GPT-5 Models
      'avalai/gpt-5': '🚀 GPT-5 (Latest)',
      'avalai/gpt-5-mini': '⚡ GPT-5 Mini (Fast)',
      'avalai/gpt-5-2025-08-07': '📅 GPT-5 (Aug 2025)',
      
      // 🧠 OpenAI O3 Series
      'avalai/o3-pro': '🧠 O3 Pro (Reasoning)',
      'avalai/o3': '🧠 O3 (Advanced)',
      'avalai/o3-2025-04-16': '📅 O3 (April 2025)',
      'avalai/o1-pro': '🧠 O1 Pro',
      'avalai/o1-mini': '🧠 O1 Mini',
      
      // 🎭 Claude 4 & 3.7 Series
      'avalai/anthropic.claude-opus-4-1-20250805-v1.0': '🎭 Claude 4.1 Opus (Latest)',
      'avalai/anthropic.claude-opus-4-20250514-v1.0': '🎭 Claude 4 Opus',
      'avalai/anthropic.claude-sonnet-4-20250514-v1.0': '🎭 Claude 4 Sonnet',
      'avalai/anthropic.claude-3-7-sonnet-20250219-v1.0': '🎭 Claude 3.7 Sonnet',
      'avalai/anthropic.claude-3-5-sonnet-20241022-v2.0': '🎭 Claude 3.5 Sonnet V2',
      
      // 💎 Google Gemini Series
      'avalai/gemini-2.5-flash-lite': '💎 Gemini 2.5 Flash Lite',
      'avalai/gemini-2.0-pro-exp-02-05': '💎 Gemini 2.0 Pro (Experimental)',
      'avalai/gemini-1.5-pro-latest': '💎 Gemini 1.5 Pro (Latest)',
      
      // 🚀 xAI Grok Series
      'avalai/grok-4': '🚀 Grok-4 (Latest)',
      'avalai/grok-3-fast-beta': '⚡ Grok-3 Fast (Beta)',
      'avalai/grok-3-mini-beta': '⚡ Grok-3 Mini (Beta)',
      
      // 💻 Specialized Coding Models
      'avalai/deepseek-coder': '💻 DeepSeek Coder (Specialized)',
      'avalai/qwen3-coder-plus': '💻 Qwen3 Coder Plus',
      'avalai/codestral-2501': '💻 Codestral 2501',
      'avalai/computer-use-preview-2025-03-11': '💻 Computer Use (Preview)',
      
      // 🎯 Groq Models
      'avalai/groq-4-0709': '🎯 Groq-4 (Fast)',
      'avalai/groq-3': '🎯 Groq-3',
      
      // 🔧 Utility Models
      'avalai/gpt-4-turbo-2024-04-09': '🔧 GPT-4 Turbo (April 2024)',
      'avalai/whisper-1': '🔧 Whisper-1 (Audio)',
      'avalai/text-embedding-3-large': '🔧 Text Embedding 3 Large',
      
      // Legacy Models
      'google/gemini-pro': 'Gemini Pro (free)',
      'google/gemini-1.5-flash': 'Gemini 1.5 Flash (free)',
      'openai/gpt-5': 'GPT-5',
      'moonshotai/kimi-k2-instruct': 'Kimi K2 Instruct',
      'anthropic/claude-sonnet-4-20250514': 'Sonnet 4'
    },
    
    // Model categories for UI organization
    modelCategories: {
      '🚀 Latest & Most Advanced': [
        'avalai/gpt-5',
        'avalai/o3-pro',
        'avalai/anthropic.claude-opus-4-1-20250805-v1.0'
      ],
      '⚡ Fast & Efficient': [
        'avalai/gpt-5-mini',
        'avalai/grok-3-fast-beta',
        'avalai/gemini-2.5-flash-lite'
      ],
      '💻 Specialized Coding': [
        'avalai/deepseek-coder',
        'avalai/qwen3-coder-plus',
        'avalai/codestral-2501'
      ],
      '🎭 Creative & Writing': [
        'avalai/anthropic.claude-3-7-sonnet-20250219-v1.0',
        'avalai/gemini-2.0-pro-exp-02-05'
      ],
      '🧠 Advanced Reasoning': [
        'avalai/o3-pro',
        'avalai/o3',
        'avalai/o1-pro'
      ],
      '🎯 Fast Inference': [
        'avalai/groq-4-0709',
        'avalai/groq-3',
        'avalai/grok-3-mini-beta'
      ],
      '🔧 Utility & Tools': [
        'avalai/whisper-1',
        'avalai/text-embedding-3-large',
        'avalai/computer-use-preview-2025-03-11'
      ],
      '📚 Legacy Models': [
        'google/gemini-pro',
        'google/gemini-1.5-flash',
        'openai/gpt-5'
      ]
    },
    
    // Smart model recommendations by task type
    modelRecommendations: {
      'website-cloning': 'avalai/gpt-5-mini',
      'code-generation': 'avalai/deepseek-coder',
      'creative-writing': 'avalai/anthropic.claude-opus-4-1-20250805-v1.0',
      'complex-reasoning': 'avalai/o3-pro',
      'fast-responses': 'avalai/grok-3-fast-beta',
      'multimodal': 'avalai/computer-use-preview-2025-03-11',
      'audio-processing': 'avalai/whisper-1'
    },
    
    // Temperature settings for non-reasoning models
    defaultTemperature: 0.7,
    
    // Max tokens for code generation
    maxTokens: 8000,
    
    // Max tokens for truncation recovery
    truncationRecoveryMaxTokens: 4000,
  },
  
  // Code Application Configuration
  codeApplication: {
    // Delay after applying code before refreshing iframe (milliseconds)
    defaultRefreshDelay: 2000,
    
    // Delay when packages are installed (milliseconds)
    packageInstallRefreshDelay: 5000,
    
    // Enable/disable automatic truncation recovery
    enableTruncationRecovery: false, // Disabled - too many false positives
    
    // Maximum number of truncation recovery attempts per file
    maxTruncationRecoveryAttempts: 1,
  },
  
  // UI Configuration
  ui: {
    // Show/hide certain UI elements
    showModelSelector: true,
    showStatusIndicator: true,
    
    // Animation durations (milliseconds)
    animationDuration: 200,
    
    // Toast notification duration (milliseconds)
    toastDuration: 3000,
    
    // Maximum chat messages to keep in memory
    maxChatMessages: 100,
    
    // Maximum recent messages to send as context
    maxRecentMessagesContext: 20,
  },
  
  // Development Configuration
  dev: {
    // Enable debug logging
    enableDebugLogging: true,
    
    // Enable performance monitoring
    enablePerformanceMonitoring: false,
    
    // Log API responses
    logApiResponses: true,
  },
  
  // Package Installation Configuration
  packages: {
    // Use --legacy-peer-deps flag for npm install
    useLegacyPeerDeps: true,
    
    // Package installation timeout (milliseconds)
    installTimeout: 60000,
    
    // Auto-restart Vite after package installation
    autoRestartVite: true,
  },
  
  // File Management Configuration
  files: {
    // Excluded file patterns (files to ignore)
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      '.next/**',
      'dist/**',
      'build/**',
      '*.log',
      '.DS_Store'
    ],
    
    // Maximum file size to read (bytes)
    maxFileSize: 1024 * 1024, // 1MB
    
    // File extensions to treat as text
    textFileExtensions: [
      '.js', '.jsx', '.ts', '.tsx',
      '.css', '.scss', '.sass',
      '.html', '.xml', '.svg',
      '.json', '.yml', '.yaml',
      '.md', '.txt', '.env',
      '.gitignore', '.dockerignore'
    ],
  },
  
  // API Endpoints Configuration (for external services)
  api: {
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
    
    // Request timeout (milliseconds)
    requestTimeout: 30000,
  }
};

// Type-safe config getter
export function getConfig<K extends keyof typeof appConfig>(key: K): typeof appConfig[K] {
  return appConfig[key];
}

// Helper to get nested config values
export function getConfigValue(path: string): any {
  return path.split('.').reduce((obj, key) => obj?.[key], appConfig as any);
}

export default appConfig;