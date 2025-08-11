import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Model configuration with priority order
export const MODEL_CONFIG = {
  // Priority 1: Free Models (Try These First)
  freeModels: [
    { id: 'gemini-pro', name: 'Gemini Pro (Free)', provider: 'google', tier: 'free', priority: 1 },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Free)', provider: 'google', tier: 'free', priority: 2 },
    { id: 'avalai/gpt-4o-mini', name: 'GPT-4o Mini (AvalAI Free)', provider: 'avalai', tier: 'free', priority: 3 },
    { id: 'avalai/deepseek-coder', name: 'DeepSeek Coder (Free)', provider: 'avalai', tier: 'free', priority: 4 },
  ],
  
  // Priority 2: Premium Models (Fallback)
  premiumModels: [
    { id: 'avalai/gpt-5-mini', name: 'GPT-5 Mini (Premium)', provider: 'avalai', tier: 'premium', priority: 5 },
    { id: 'avalai/claude-4-opus', name: 'Claude 4.1 Opus (Premium)', provider: 'avalai', tier: 'premium', priority: 6 },
    { id: 'avalai/o3-pro', name: 'O3 Pro (Premium)', provider: 'avalai', tier: 'premium', priority: 7 },
    { id: 'avalai/gpt-5', name: 'GPT-5 (Premium)', provider: 'avalai', tier: 'premium', priority: 8 },
  ],
  
  // Default model selection with smart fallback
  defaultModel: 'gemini-pro',
  fallbackModels: [
    'gemini-1.5-flash',        // Free backup 1
    'avalai/gpt-4o-mini',      // Free backup 2
    'avalai/gpt-5-mini',       // Premium backup 1
    'avalai/claude-4-opus',    // Premium backup 2
    'avalai/o3-pro'            // Premium backup 3
  ],
  
  // Smart model recommendations by task type
  taskSpecificModels: {
    'website-cloning': ['gemini-pro', 'avalai/gpt-5-mini'],
    'code-generation': ['avalai/deepseek-coder', 'avalai/claude-4-opus'],
    'general-chat': ['gemini-1.5-flash', 'avalai/gpt-4o-mini'],
    'complex-tasks': ['gemini-pro', 'avalai/o3-pro']
  }
};

// Initialize AI clients
const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const avalaiClient = createOpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
});

// Model mapping for AI SDK
const MODEL_MAPPING = {
  // Google models
  'gemini-pro': { client: googleAI, model: 'gemini-pro', type: 'google' },
  'gemini-1.5-flash': { client: googleAI, model: 'gemini-1.5-flash', type: 'google' },
  
  // AvalAI models (using available models)
  'avalai/gpt-4o-mini': { client: avalaiClient, model: 'gpt-4o', type: 'openai' },
  'avalai/deepseek-coder': { client: avalaiClient, model: 'deepseek-coder', type: 'openai' },
  'avalai/gpt-5-mini': { client: avalaiClient, model: 'gpt-4o', type: 'openai' },
  'avalai/claude-4-opus': { client: avalaiClient, model: 'claude-3-opus', type: 'openai' },
  'avalai/o3-pro': { client: avalaiClient, model: 'gpt-4o', type: 'openai' },
  'avalai/gpt-5': { client: avalaiClient, model: 'gpt-4o', type: 'openai' },
};

// Smart AI client with automatic fallback
export class SmartAIClient {
  private modelHistory: Map<string, { success: boolean; lastUsed: number; errorCount: number }> = new Map();
  
  // Get recommended models for a specific task
  getRecommendedModels(taskType: string = 'general-chat'): string[] {
    const specificModels = MODEL_CONFIG.taskSpecificModels[taskType as keyof typeof MODEL_CONFIG.taskSpecificModels];
    if (specificModels) {
      return [...specificModels, ...MODEL_CONFIG.fallbackModels];
    }
    return [MODEL_CONFIG.defaultModel, ...MODEL_CONFIG.fallbackModels];
  }
  
  // Get all available models grouped by tier
  getAllModels() {
    return {
      "🆓 Free Models (Try First)": MODEL_CONFIG.freeModels.map(m => m.id),
      "💎 Premium Models (Backup)": MODEL_CONFIG.premiumModels.map(m => m.id)
    };
  }
  
  // Smart model selection based on history and availability
  private selectBestModel(preferredModel?: string, taskType?: string): string[] {
    const recommendedModels = this.getRecommendedModels(taskType);
    
    // If a specific model is preferred and available, try it first
    if (preferredModel && MODEL_MAPPING[preferredModel as keyof typeof MODEL_MAPPING]) {
      return [preferredModel, ...recommendedModels.filter(m => m !== preferredModel)];
    }
    
    // Otherwise, use recommended order with smart fallback
    return recommendedModels;
  }
  
  // Try a specific model
  private async tryModel(client: any, model: string, prompt: string, type: 'google' | 'openai'): Promise<any> {
    try {
      console.log(`[SmartAI] Trying model: ${model} (${type})`);
      
      if (type === 'google') {
        const result = await streamText({
          model: client[model],
          prompt,
          maxTokens: 8000,
          temperature: 0.7,
        });
        return result;
      } else {
        const result = await streamText({
          model: client.chat(model),
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 8000,
          temperature: 0.7,
        });
        return result;
      }
    } catch (error) {
      console.error(`[SmartAI] Model ${model} failed:`, error);
      this.recordModelFailure(model);
      throw error;
    }
  }
  
  // Record model success/failure for future optimization
  private recordModelSuccess(model: string) {
    const history = this.modelHistory.get(model) || { success: false, lastUsed: Date.now(), errorCount: 0 };
    history.success = true;
    history.lastUsed = Date.now();
    history.errorCount = Math.max(0, history.errorCount - 1);
    this.modelHistory.set(model, history);
  }
  
  private recordModelFailure(model: string) {
    const history = this.modelHistory.get(model) || { success: false, lastUsed: Date.now(), errorCount: 0 };
    history.success = false;
    history.lastUsed = Date.now();
    history.errorCount += 1;
    this.modelHistory.set(model, history);
  }
  
  // Main method to get AI response with smart fallback
  async getAIResponse(
    prompt: string, 
    preferredModel?: string, 
    taskType?: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    } = {}
  ) {
    const modelsToTry = this.selectBestModel(preferredModel, taskType);
    
    console.log(`[SmartAI] Trying models in order:`, modelsToTry);
    
    for (const modelId of modelsToTry) {
      const modelConfig = MODEL_MAPPING[modelId as keyof typeof MODEL_MAPPING];
      
      if (!modelConfig) {
        console.warn(`[SmartAI] Model ${modelId} not configured, skipping...`);
        continue;
      }
      
      try {
        const { client, model, type } = modelConfig;
        
        // Check if model has too many recent failures
        const history = this.modelHistory.get(modelId);
        if (history && history.errorCount > 3 && Date.now() - history.lastUsed < 300000) { // 5 minutes
          console.log(`[SmartAI] Skipping ${modelId} due to recent failures`);
          continue;
        }
        
        const response = await this.tryModel(client, model, prompt, type);
        
        console.log(`[SmartAI] Response from ${modelId}:`, {
          hasResponse: !!response,
          responseType: typeof response,
          responseKeys: response ? Object.keys(response) : 'no response',
          hasTextStream: response ? 'textStream' in response : false
        });
        
        if (response) {
          this.recordModelSuccess(modelId);
          console.log(`[SmartAI] Success with model: ${modelId}`);
          return {
            response,
            model: modelId,
            tier: this.getModelTier(modelId),
            provider: this.getModelProvider(modelId)
          };
        }
      } catch (error) {
        console.log(`[SmartAI] Model ${modelId} failed, trying next...`);
        this.recordModelFailure(modelId);
        continue;
      }
    }
    
    throw new Error('All AI models failed to respond');
  }
  
  // Helper methods
  private getModelTier(modelId: string): 'free' | 'premium' {
    const freeModel = MODEL_CONFIG.freeModels.find(m => m.id === modelId);
    const premiumModel = MODEL_CONFIG.premiumModels.find(m => m.id === modelId);
    
    if (freeModel) return 'free';
    if (premiumModel) return 'premium';
    return 'premium'; // Default to premium for unknown models
  }
  
  private getModelProvider(modelId: string): string {
    const freeModel = MODEL_CONFIG.freeModels.find(m => m.id === modelId);
    const premiumModel = MODEL_CONFIG.premiumModels.find(m => m.id === modelId);
    
    if (freeModel) return freeModel.provider;
    if (premiumModel) return premiumModel.provider;
    return 'unknown';
  }
  
  // Get model statistics for monitoring
  getModelStats() {
    return Object.fromEntries(this.modelHistory.entries());
  }
  
  // Reset model history (useful for testing)
  resetModelHistory() {
    this.modelHistory.clear();
  }
}

// Export singleton instance
export const smartAIClient = new SmartAIClient();

// Export helper functions
export function getModelDisplayName(modelId: string): string {
  const freeModel = MODEL_CONFIG.freeModels.find(m => m.id === modelId);
  const premiumModel = MODEL_CONFIG.premiumModels.find(m => m.id === modelId);
  
  if (freeModel) return freeModel.name;
  if (premiumModel) return premiumModel.name;
  return modelId;
}

export function isFreeModel(modelId: string): boolean {
  return MODEL_CONFIG.freeModels.some(m => m.id === modelId);
}

export function isPremiumModel(modelId: string): boolean {
  return MODEL_CONFIG.premiumModels.some(m => m.id === modelId);
}