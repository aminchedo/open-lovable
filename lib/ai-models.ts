export interface AIModel {
  id: string;
  name: string;
  provider: 'avalai' | 'google';
  tier: 'free' | 'premium';
  category: 'latest' | 'reasoning' | 'creative' | 'coding' | 'multimodal' | 'utility' | 'conversational' | 'legacy';
  description?: string;
  maxTokens?: number;
}

export const AI_MODELS: AIModel[] = [
  // Latest GPT-5 Series
  { id: 'gpt-5', name: 'GPT-5 (Latest)', provider: 'avalai', tier: 'premium', category: 'latest', description: 'Most advanced OpenAI model', maxTokens: 8000 },
  { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'avalai', tier: 'premium', category: 'latest', description: 'Fast and efficient', maxTokens: 4000 },
  
  // Reasoning Models
  { id: 'o3-pro', name: 'O3 Pro', provider: 'avalai', tier: 'premium', category: 'reasoning', description: 'Advanced reasoning', maxTokens: 6000 },
  { id: 'o1-pro', name: 'O1 Pro', provider: 'avalai', tier: 'premium', category: 'reasoning', description: 'Complex logic', maxTokens: 6000 },
  { id: 'o1-mini', name: 'O1 Mini', provider: 'avalai', tier: 'free', category: 'reasoning', description: 'Fast reasoning', maxTokens: 4000 },
  
  // Claude Series
  { id: 'anthropic.claude-opus-4-1-20250805-v1.0', name: 'Claude 4.1 Opus', provider: 'avalai', tier: 'premium', category: 'creative', description: 'Best Anthropic model', maxTokens: 8000 },
  { id: 'anthropic.claude-sonnet-4-20250514-v1.0', name: 'Claude 4 Sonnet', provider: 'avalai', tier: 'premium', category: 'creative', maxTokens: 6000 },
  { id: 'anthropic.claude-3-haiku-20240307-v1.0', name: 'Claude 3 Haiku', provider: 'avalai', tier: 'free', category: 'creative', maxTokens: 4000 },
  
  // Coding Models
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'avalai', tier: 'free', category: 'coding', description: 'Programming specialist', maxTokens: 6000 },
  { id: 'qwen3-coder-plus', name: 'Qwen3 Coder Plus', provider: 'avalai', tier: 'premium', category: 'coding', maxTokens: 6000 },
  
  // Gemini Series
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash', provider: 'avalai', tier: 'premium', category: 'multimodal', maxTokens: 6000 },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', provider: 'avalai', tier: 'free', category: 'multimodal', maxTokens: 6000 },
  { id: 'gemini-pro', name: 'Gemini Pro (Google)', provider: 'google', tier: 'free', category: 'multimodal', maxTokens: 4000 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Google)', provider: 'google', tier: 'free', category: 'multimodal', maxTokens: 4000 },
  
  // Grok Series
  { id: 'grok-4', name: 'Grok-4', provider: 'avalai', tier: 'premium', category: 'conversational', maxTokens: 6000 },
  { id: 'grok-3-fast-beta', name: 'Grok-3 Fast', provider: 'avalai', tier: 'premium', category: 'conversational', maxTokens: 4000 },
  
  // Legacy Models
  { id: 'gpt-4-turbo-2024-04-09', name: 'GPT-4 Turbo', provider: 'avalai', tier: 'premium', category: 'legacy', maxTokens: 6000 },
  { id: 'gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini', provider: 'avalai', tier: 'free', category: 'legacy', maxTokens: 4000 },
];

export const MODEL_CATEGORIES = {
  "🔥 Latest Models": AI_MODELS.filter(m => m.category === 'latest'),
  "🧠 Reasoning": AI_MODELS.filter(m => m.category === 'reasoning'),
  "🎭 Creative": AI_MODELS.filter(m => m.category === 'creative'),
  "💻 Coding": AI_MODELS.filter(m => m.category === 'coding'),
  "💎 Multimodal": AI_MODELS.filter(m => m.category === 'multimodal'),
  "⚡ Conversational": AI_MODELS.filter(m => m.category === 'conversational'),
  "🆓 Free Models": AI_MODELS.filter(m => m.tier === 'free'),
};

export const DEFAULT_MODEL = 'gpt-5-mini';