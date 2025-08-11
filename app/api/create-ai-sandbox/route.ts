import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[create-ai-sandbox] Starting request');
  
  try {
    const e2bApiKey = process.env.E2B_API_KEY;
    
    if (!e2bApiKey) {
      return NextResponse.json(
        { 
          success: false,
          error: 'E2B_API_KEY not configured',
          code: 'MISSING_API_KEY'
        },
        { status: 500 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    const { template = 'nodejs' } = body;
    
    // Use new e2b package (NOT @e2b/sdk)
    const { Sandbox } = await import('e2b');
    
    const sandbox = await Sandbox.create(template, {
      apiKey: e2bApiKey,
    });
    
    const info = await sandbox.getInfo();
    return NextResponse.json({
      success: true,
      sandboxId: info.sandboxId,
      url: sandbox.getHost(3000),
      template: template,
    });
    
  } catch (error: any) {
    console.error('[create-ai-sandbox] Error:', error.message);
    
    if (error.message?.includes('401')) {
      return NextResponse.json(
        { success: false, error: 'Invalid E2B API key' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Sandbox creation failed' },
      { status: 500 }
    );
  }
}