import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[create-ai-sandbox] Request received');
  
  try {
    // Environment validation
    const e2bApiKey = process.env.E2B_API_KEY;
    
    if (!e2bApiKey) {
      console.error('[create-ai-sandbox] E2B_API_KEY missing');
      return NextResponse.json(
        { 
          success: false,
          error: 'E2B_API_KEY not configured',
          code: 'MISSING_API_KEY'
        },
        { status: 500 }
      );
    }
    
    // Validate API key format
    if (!e2bApiKey.startsWith('E2b_') && !e2bApiKey.startsWith('e2b_')) {
      console.error('[create-ai-sandbox] Invalid API key format');
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid E2B API key format',
          code: 'INVALID_API_KEY_FORMAT'
        },
        { status: 401 }
      );
    }
    
    console.log(`[create-ai-sandbox] API key validated (length: ${e2bApiKey.length})`);
    
    // Parse request body
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
    
    const { template = 'nodejs' } = body;
    console.log(`[create-ai-sandbox] Creating sandbox with template: ${template}`);
    
    // Import and create sandbox
    const { Sandbox } = await import('@e2b/sdk');
    
    const sandbox = await Sandbox.create({
      template,
      apiKey: e2bApiKey,
      timeout: 30000,
    });
    
    console.log(`[create-ai-sandbox] Sandbox created successfully: ${sandbox.id}`);
    
    return NextResponse.json({
      success: true,
      sandboxId: sandbox.id,
      url: sandbox.url,
      template: template,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('[create-ai-sandbox] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific E2B errors
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized: Invalid E2B API key',
          code: 'E2B_UNAUTHORIZED'
        },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sandbox creation timeout',
          code: 'E2B_TIMEOUT'
        },
        { status: 408 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: 'Sandbox creation failed',
        code: 'E2B_CREATION_FAILED',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}