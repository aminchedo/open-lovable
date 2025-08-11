import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[create-ai-sandbox] Starting request');
  
  try {
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
    
    console.log(`[create-ai-sandbox] API key validated (length: ${e2bApiKey.length})`);
    
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
    
    // Import E2B SDK with proper error handling
    let Sandbox;
    try {
      const e2bModule = await import('e2b');
      Sandbox = e2bModule.Sandbox;
    } catch (importError) {
      console.error('[create-ai-sandbox] Failed to import E2B SDK:', importError);
      return NextResponse.json(
        { 
          success: false,
          error: 'E2B SDK import failed',
          code: 'SDK_IMPORT_ERROR'
        },
        { status: 500 }
      );
    }
    
    // Create sandbox with timeout
    const sandbox = await Promise.race([
      Sandbox.create({
        template,
        apiKey: e2bApiKey,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sandbox creation timeout')), 30000)
      )
    ]);
    
    console.log(`[create-ai-sandbox] Sandbox created successfully: ${sandbox.id}`);
    
    return NextResponse.json({
      success: true,
      sandboxId: sandbox.id,
      url: sandbox.url || `https://sandbox.e2b.dev/${sandbox.id}`,
      template: template,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('[create-ai-sandbox] Error details:', {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
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