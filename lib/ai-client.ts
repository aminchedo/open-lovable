import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from './ai-models';

const avalaiClient = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY!,
  baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
});

const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequestOptions {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export class AIClientService {
  static async getResponse(options: AIRequestOptions): Promise<string> {
    const { model, messages, maxTokens = 4000, temperature = 0.7 } = options;
    
    const modelConfig = AI_MODELS.find(m => m.id === model);
    if (!modelConfig) {
      throw new Error(`Model ${model} not found`);
    }

    try {
      if (modelConfig.provider === 'avalai') {
        const response = await avalaiClient.chat.completions.create({
          model: model,
          messages: messages,
          max_tokens: Math.min(maxTokens, modelConfig.maxTokens || 4000),
          temperature: temperature,
        });

        return response.choices[0]?.message?.content || 'No response generated';
      } 
      
      if (modelConfig.provider === 'google') {
        const googleModel = googleAI.getGenerativeModel({ 
          model: model.replace('gemini-pro', 'gemini-1.5-pro')
        });
        
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        const result = await googleModel.generateContent(prompt);
        
        return result.response.text();
      }
      
      throw new Error(`Provider ${modelConfig.provider} not supported`);
    } catch (error: any) {
      console.error(`Error with ${model}:`, error);
      
      // Fallback to gpt-5-mini if current model fails
      if (model !== 'gpt-5-mini') {
        console.log('Falling back to gpt-5-mini');
        return await this.getResponse({ 
          ...options, 
          model: 'gpt-5-mini' 
        });
      }
      
      throw new Error(`AI request failed: ${error.message}`);
    }
  }

  static getModelById(modelId: string) {
    return AI_MODELS.find(m => m.id === modelId);
  }

  static getFreeModels() {
    return AI_MODELS.filter(m => m.tier === 'free');
  }

  static getPremiumModels() {
    return AI_MODELS.filter(m => m.tier === 'premium');
  }
}