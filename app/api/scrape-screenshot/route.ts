import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not found in environment variables');
      return NextResponse.json({
        error: 'Firecrawl API key not configured',
        code: 'MISSING_FIRECRAWL_KEY',
      }, { status: 500 });
    }

    // Use Firecrawl API to capture screenshot
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        formats: ['screenshot'],
        waitFor: 3000,
        timeout: 30000,
        blockAds: true,
        actions: [
          {
            type: 'wait',
            milliseconds: 2000
          }
        ]
      })
    });

    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }

    const data = await firecrawlResponse.json();

    if (!data.success || !data.data?.screenshot) {
      throw new Error('Failed to capture screenshot');
    }

    return NextResponse.json({
      success: true,
      screenshot: data.data.screenshot,
      metadata: data.data.metadata
    });

  } catch (error: any) {
    console.error('Screenshot capture error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to capture screenshot'
    }, { status: 500 });
  }
}