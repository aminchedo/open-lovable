import { NextRequest, NextResponse } from 'next/server';
import { AIClientService } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  console.log('[ai-chat] Starting AI chat request');
  
  try {
    const body = await request.json();
    const { model, messages, maxTokens = 4000, temperature = 0.7 } = body;

    if (!model || !messages) {
      return NextResponse.json(
        { error: 'Model and messages are required', code: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages must be a non-empty array', code: 'INVALID_MESSAGES' },
        { status: 400 }
      );
    }

    console.log('[ai-chat] Using model:', model);

    const response = await AIClientService.getResponse({
      model,
      messages,
      maxTokens,
      temperature,
    });

    console.log('[ai-chat] AI response generated successfully');

    return NextResponse.json({
      success: true,
      response,
      model,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[ai-chat] Error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'AI request failed', 
        code: 'AI_REQUEST_FAILED',
        message: error.message 
      },
      { status: 500 }
    );
  }
}