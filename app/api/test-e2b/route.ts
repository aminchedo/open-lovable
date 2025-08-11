import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const e2bApiKey = process.env.E2B_API_KEY;
  
  if (!e2bApiKey) {
    return NextResponse.json({
      success: false,
      error: 'E2B_API_KEY not configured',
      code: 'MISSING_API_KEY'
    }, { status: 500 });
  }

  // Test E2B API key format
  const isValidFormat = /^e2b_[a-zA-Z0-9]{32}$/i.test(e2bApiKey);
  
  if (!isValidFormat) {
    return NextResponse.json({
      success: false,
      error: 'Invalid E2B API key format',
      code: 'INVALID_FORMAT',
      expectedFormat: 'e2b_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      actualLength: e2bApiKey.length,
      startsWithE2b: e2bApiKey.toLowerCase().startsWith('e2b_')
    }, { status: 400 });
  }

  try {
    // Import E2B and test connection
    const e2bModule = await import('e2b');
    const Sandbox = e2bModule.Sandbox;
    
    // Try to create a sandbox to test the API key
    const sandbox = await Sandbox.create({
      template: 'nodejs',
      apiKey: e2bApiKey,
    });
    
    // If successful, immediately close the sandbox
    await sandbox.close();
    
    return NextResponse.json({
      success: true,
      message: 'E2B API key is valid and working',
      sandboxId: sandbox.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'E2B API key test failed',
      code: 'API_TEST_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}