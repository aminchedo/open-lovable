import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[generate-ai-code-stream] Starting request');
  
  try {
    // Check if we have alternative AI APIs instead of Groq
    const avalaiApiKey = process.env.AVALAI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!avalaiApiKey && !groqApiKey) {
      return NextResponse.json(
        { error: 'No AI API keys configured. Need AVALAI_API_KEY or GROQ_API_KEY.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, model = 'gpt-5-mini' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use AvalAI instead of Groq
    if (avalaiApiKey) {
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
        stream: false,
      });

      return NextResponse.json({
        success: true,
        response: response.choices[0]?.message?.content || 'No response generated',
        model: model,
      });
    }

    // Fallback to Groq if available
    if (groqApiKey) {
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: groqApiKey });

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      });

      return NextResponse.json({
        success: true,
        response: response.choices[0]?.message?.content || 'No response generated',
        model: 'mixtral-8x7b-32768',
      });
    }

    return NextResponse.json(
      { error: 'No working AI API available' },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('[generate-ai-code-stream] Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'AI code generation failed', details: error.message },
      { status: 500 }
    );
  }
}