import { NextRequest, NextResponse } from 'next/server';

function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && 
           urlObj.hostname.length > 3 &&
           urlObj.hostname.includes('.');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('[scrape-screenshot] Request received');
  
  try {
    // Environment validation
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      console.error('[scrape-screenshot] FIRECRAWL_API_KEY missing');
      return NextResponse.json(
        { 
          success: false,
          error: 'FIRECRAWL_API_KEY not configured',
          code: 'MISSING_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log(`[scrape-screenshot] API key validated (length: ${firecrawlApiKey.length})`);
    
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
    
    let { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { 
          success: false,
          error: 'URL parameter is required',
          code: 'MISSING_URL'
        },
        { status: 400 }
      );
    }
    
    // URL preprocessing
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (!validateUrl(url)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid URL format',
          code: 'INVALID_URL',
          example: 'https://example.com'
        },
        { status: 400 }
      );
    }
    
    console.log(`[scrape-screenshot] Processing URL: ${url}`);
    
    // Import and use Firecrawl
    const FirecrawlApp = (await import('@mendable/firecrawl-js')).default;
    const app = new FirecrawlApp({ apiKey: firecrawlApiKey });
    
    // Use scrapeUrl with screenshot format
    const result = await app.scrapeUrl(url, {
      formats: ['screenshot'],
      onlyMainContent: false,
      timeout: 30000
    });
    
    console.log('[scrape-screenshot] Screenshot captured successfully');
    
    // Check if result has screenshot property (success case)
    if ('screenshot' in result) {
      return NextResponse.json({
        success: true,
        screenshot: result.screenshot,
        url: url,
        metadata: result.metadata,
        timestamp: new Date().toISOString()
      });
    } else {
      // Error case
      return NextResponse.json({
        success: false,
        error: 'Screenshot capture failed',
        code: 'FIRECRAWL_SCREENSHOT_FAILED',
        details: 'No screenshot data received'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('[scrape-screenshot] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific Firecrawl errors
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized: Invalid Firecrawl API key',
          code: 'FIRECRAWL_UNAUTHORIZED'
        },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Screenshot capture timeout',
          code: 'FIRECRAWL_TIMEOUT'
        },
        { status: 408 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: 'Screenshot capture failed',
        code: 'FIRECRAWL_SCREENSHOT_FAILED',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}