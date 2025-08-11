import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[create-ai-sandbox] Starting sandbox creation');
  
  try {
    const e2bApiKey = process.env.E2B_API_KEY;
    
    if (!e2bApiKey) {
      return NextResponse.json(
        { error: 'E2B_API_KEY not configured', code: 'MISSING_KEY' },
        { status: 500 }
      );
    }

    if (!e2bApiKey.startsWith('E2b_') && !e2bApiKey.startsWith('e2b_')) {
      return NextResponse.json(
        { error: 'Invalid E2B API key format', code: 'INVALID_FORMAT' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const template = body.template || 'nodejs';
    
    const { createSandbox } = await import('@e2b/sdk');
    
    const sandbox = await createSandbox({
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
    console.error('[create-ai-sandbox] Error:', error.message);
    
    if (error.message?.includes('401') || error.message?.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Invalid E2B API key', code: 'INVALID_KEY' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('authorization header is malformed')) {
      return NextResponse.json(
        { error: 'Malformed E2B API key', code: 'MALFORMED_KEY' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Sandbox creation failed', code: 'CREATION_FAILED', message: error.message },
      { status: 500 }
    );
  }
}