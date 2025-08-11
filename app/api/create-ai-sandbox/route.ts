import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[create-ai-sandbox] Starting request');
  
  try {
    const e2bApiKey = process.env.E2B_API_KEY;
    
    if (!e2bApiKey) {
      console.error('[create-ai-sandbox] E2B_API_KEY missing');
      return NextResponse.json(
        { error: 'E2B_API_KEY not configured in environment variables' },
        { status: 500 }
      );
    }

    console.log('[create-ai-sandbox] API key found, length:', e2bApiKey.length);

    const body = await request.json();
    const template = body.template || 'nodejs';
    
    const { Sandbox } = await import('@e2b/sdk');
    
    // Explicit API key configuration
    const sandbox = await Sandbox.create({
      template,
      apiKey: e2bApiKey,
      timeout: 30000,
    });

    console.log('[create-ai-sandbox] Success:', sandbox.id);
    
    return NextResponse.json({ 
      success: true, 
      sandboxId: sandbox.id,
      url: sandbox.url 
    });

  } catch (error: any) {
    console.error('[create-ai-sandbox] Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    if (error.message?.includes('401') || error.message?.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Invalid E2B API key. Check environment variables.' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('authorization header')) {
      return NextResponse.json(
        { error: 'E2B authorization header issue. API key format problem.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Sandbox creation failed', details: error.message },
      { status: 500 }
    );
  }
}