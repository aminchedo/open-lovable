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

    const { FirecrawlApp } = await import('@mendable/firecrawl-js');
    
    // Explicit API key configuration
    const app = new FirecrawlApp({ 
      apiKey: firecrawlApiKey 
    });
    
    const screenshotResponse = await app.screenshot(url, {
      waitFor: 3000,
      fullPage: true,
    });

    console.log('[scrape-screenshot] Screenshot captured successfully');

    return NextResponse.json({
      success: true,
      screenshot: screenshotResponse.screenshot,
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