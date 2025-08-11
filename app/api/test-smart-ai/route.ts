import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gemini-pro' } = await request.json();
    
    console.log('[test-smart-ai] Testing with prompt:', prompt);
    console.log('[test-smart-ai] Requested model:', model);
    
    // Priority 1: Try Google AI (Free) first
    if (model === 'gemini-pro' || model === 'gemini-1.5-flash') {
      try {
        console.log('[test-smart-ai] Trying Google AI...');
        const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
        const googleModel = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await googleModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('[test-smart-ai] Google AI success!');
        return NextResponse.json({
          success: true,
          model: 'gemini-1.5-flash',
          tier: 'free',
          provider: 'google',
          response: text
        });
        
      } catch (googleError) {
        console.log('[test-smart-ai] Google AI failed, trying AvalAI...');
        // Fall through to AvalAI
      }
    }
    
    // Priority 2: Try AvalAI (Premium) as fallback
    try {
      console.log('[test-smart-ai] Trying AvalAI...');
      const avalaiClient = createOpenAI({
        apiKey: process.env.AVALAI_API_KEY,
        baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
      });
      
      const completion = await avalaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      const text = completion.choices[0]?.message?.content || 'No response';
      
      console.log('[test-smart-ai] AvalAI success!');
      return NextResponse.json({
        success: true,
        model: 'avalai/gpt-4o',
        tier: 'premium',
        provider: 'avalai',
        response: text
      });
      
    } catch (avalaiError) {
      console.log('[test-smart-ai] AvalAI failed:', avalaiError);
      throw new Error('All AI models failed');
    }
    
  } catch (error) {
    console.error('[test-smart-ai] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}