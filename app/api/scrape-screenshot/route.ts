import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[scrape-screenshot] Starting request');
  
  try {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      console.error('[scrape-screenshot] FIRECRAWL_API_KEY missing');
      return NextResponse.json(
        { error: 'FIRECRAWL_API_KEY not configured in environment variables' },
        { status: 500 }
      );
    }

    console.log('[scrape-screenshot] API key found, length:', firecrawlApiKey.length);

    const body = await request.json();
    let { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // URL formatting
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    console.log('[scrape-screenshot] Processing URL:', url);

    const firecrawlModule = await import('@mendable/firecrawl-js');
    const Firecrawl = firecrawlModule.default;
    
    // Explicit API key configuration
    const app = new Firecrawl({ 
      apiKey: firecrawlApiKey 
    });
    
    // Use scrapeUrl with screenshot format
    const screenshotResponse = await app.scrapeUrl(url, {
      formats: ['screenshot', 'screenshot@fullPage'],
      waitFor: 3000,
      timeout: 20000,
    });

    console.log('[scrape-screenshot] Screenshot captured successfully');

    return NextResponse.json({
      success: true,
      screenshot: (screenshotResponse as any)?.data?.[0]?.screenshot || (screenshotResponse as any)?.screenshot,
      url: url,
    });

  } catch (error: any) {
    console.error('[scrape-screenshot] Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    if (error.message?.includes('Unauthorized') || error.message?.includes('Invalid token')) {
      return NextResponse.json(
        { error: 'Invalid Firecrawl API key. Check environment variables.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Screenshot failed', details: error.message },
      { status: 500 }
    );
  }
}