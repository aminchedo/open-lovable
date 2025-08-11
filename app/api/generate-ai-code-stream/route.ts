import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[generate-ai-code-stream] Starting request');
  
  try {
    // Check available AI APIs
    const avalaiApiKey = process.env.AVALAI_API_KEY;
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!avalaiApiKey && !googleApiKey) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No AI API keys configured',
          code: 'MISSING_AI_KEYS'
        },
        { status: 500 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON body',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }
    
    const { prompt, model = 'gpt-4' } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Prompt is required',
          code: 'MISSING_PROMPT'
        },
        { status: 400 }
      );
    }
    
    console.log(`[generate-ai-code-stream] Processing with model: ${model}`);
    
    // Try AvalAI first
    if (avalaiApiKey) {
      try {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({
          apiKey: avalaiApiKey,
          baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
        });

        const response = await client.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
          temperature: 0.7,
        });

        console.log('[generate-ai-code-stream] AvalAI response successful');

        return NextResponse.json({
          success: true,
          response: response.choices[0]?.message?.content || 'No response generated',
          model: model,
          provider: 'avalai',
          timestamp: new Date().toISOString()
        });
      } catch (avalaiError) {
        console.log('[generate-ai-code-stream] AvalAI failed, trying Google AI');
      }
    }
    
    // Fallback to Google AI
    if (googleApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(googleApiKey);
        const googleModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await googleModel.generateContent(prompt);
        const response = await result.response;
        
        console.log('[generate-ai-code-stream] Google AI response successful');
        
        return NextResponse.json({
          success: true,
          response: response.text(),
          model: 'gemini-pro',
          provider: 'google',
          timestamp: new Date().toISOString()
        });
      } catch (googleError) {
        console.error('[generate-ai-code-stream] Google AI failed:', googleError);
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'All AI providers failed',
        code: 'ALL_AI_PROVIDERS_FAILED'
      },
      { status: 500 }
    );
    
  } catch (error: any) {
    console.error('[generate-ai-code-stream] Error:', error.message);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'AI code generation failed',
        code: 'AI_GENERATION_FAILED',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}