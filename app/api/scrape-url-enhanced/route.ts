import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[scrape-url-enhanced] Starting request');
  
  try {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      console.error('[scrape-url-enhanced] FIRECRAWL_API_KEY missing');
      return NextResponse.json(
        { error: 'FIRECRAWL_API_KEY not configured in environment variables' },
        { status: 500 }
      );
    }

    console.log('[scrape-url-enhanced] API key found, length:', firecrawlApiKey.length);

    const body = await request.json();
    let { url, options = {} } = body;
    
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

    console.log('[scrape-url-enhanced] Processing URL:', url);

    const firecrawlModule = await import('@mendable/firecrawl-js');
    const Firecrawl = firecrawlModule.default;
    
    // Explicit API key configuration
    const app = new Firecrawl({ 
      apiKey: firecrawlApiKey 
    });
    
    const scrapeResponse = await app.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      includeTags: ['title', 'meta'],
      excludeTags: ['script', 'style'],
      waitFor: 3000,
      ...options,
    });

    console.log('[scrape-url-enhanced] Scraping completed successfully');

    return NextResponse.json({
      success: true,
      data: scrapeResponse,
      url: url,
    });

  } catch (error: any) {
    console.error('[scrape-url-enhanced] Error details:', {
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
      { error: 'Enhanced scraping failed', details: error.message },
      { status: 500 }
    );
  }
}