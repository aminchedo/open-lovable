import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && 
           urlObj.hostname.includes('.') && 
           urlObj.hostname.length > 3;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('[scrape-url-enhanced] Starting enhanced scraping');
  
  try {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      return NextResponse.json(
        { error: 'FIRECRAWL_API_KEY not configured', code: 'MISSING_KEY' },
        { status: 500 }
      );
    }

    const body = await request.json();
    let { url, options = {} } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required', code: 'MISSING_URL' },
        { status: 400 }
      );
    }

    // Clean and format URL
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { 
          error: 'Invalid URL format', 
          code: 'INVALID_URL',
          message: 'Please provide a valid URL like https://example.com' 
        },
        { status: 400 }
      );
    }

    console.log('[scrape-url-enhanced] Processing URL:', url);

    const { FirecrawlApp } = await import('@mendable/firecrawl-js');
    const app = new FirecrawlApp({ apiKey: firecrawlApiKey });
    
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
    console.error('[scrape-url-enhanced] Error:', error.message);
    
    if (error.message?.includes('401') || error.message?.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Invalid Firecrawl API key', code: 'INVALID_FIRECRAWL_KEY' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('URL must have a valid top-level domain')) {
      return NextResponse.json(
        { 
          error: 'Invalid URL domain', 
          code: 'INVALID_URL_DOMAIN',
          message: 'Please use a complete URL with valid domain' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Scraping failed', code: 'SCRAPING_FAILED', message: error.message },
      { status: 500 }
    );
  }
}