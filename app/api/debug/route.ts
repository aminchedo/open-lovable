import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envStatus = {
    E2B_API_KEY: {
      configured: !!process.env.E2B_API_KEY,
      format: process.env.E2B_API_KEY ? 
        (process.env.E2B_API_KEY.startsWith('E2b_') || process.env.E2B_API_KEY.startsWith('e2b_') ? 'Valid' : 'Invalid') : 
        'Not set',
      length: process.env.E2B_API_KEY?.length || 0,
    },
    FIRECRAWL_API_KEY: {
      configured: !!process.env.FIRECRAWL_API_KEY,
      format: process.env.FIRECRAWL_API_KEY ? 
        (process.env.FIRECRAWL_API_KEY.startsWith('fc-') ? 'Valid' : 'Invalid') : 
        'Not set',
      length: process.env.FIRECRAWL_API_KEY?.length || 0,
    },
    AVALAI_API_KEY: {
      configured: !!process.env.AVALAI_API_KEY,
      format: process.env.AVALAI_API_KEY ? 
        (process.env.AVALAI_API_KEY.startsWith('aa-') ? 'Valid' : 'Invalid') : 
        'Not set',
      length: process.env.AVALAI_API_KEY?.length || 0,
    },
    GOOGLE_GENERATIVE_AI_API_KEY: {
      configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      format: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 
        (process.env.GOOGLE_GENERATIVE_AI_API_KEY.startsWith('AIza') ? 'Valid' : 'Invalid') : 
        'Not set',
      length: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
    },
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  const issues = [];
  if (!envStatus.E2B_API_KEY.configured) issues.push('E2B_API_KEY not configured');
  if (!envStatus.FIRECRAWL_API_KEY.configured) issues.push('FIRECRAWL_API_KEY not configured');
  if (!envStatus.AVALAI_API_KEY.configured) issues.push('AVALAI_API_KEY not configured');
  if (!envStatus.GOOGLE_GENERATIVE_AI_API_KEY.configured) issues.push('GOOGLE_GENERATIVE_AI_API_KEY not configured');

  return NextResponse.json({
    environment: envStatus,
    issues,
    status: issues.length === 0 ? 'healthy' : 'needs_attention',
  });
}