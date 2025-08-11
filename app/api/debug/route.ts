import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('[debug] Environment check requested');
  
  const envCheck = {
    E2B_API_KEY: {
      exists: !!process.env.E2B_API_KEY,
      length: process.env.E2B_API_KEY?.length || 0,
      format: process.env.E2B_API_KEY?.startsWith('E2b_') || process.env.E2B_API_KEY?.startsWith('e2b_') ? 'Valid' : 'Invalid',
    },
    FIRECRAWL_API_KEY: {
      exists: !!process.env.FIRECRAWL_API_KEY,
      length: process.env.FIRECRAWL_API_KEY?.length || 0,
      format: process.env.FIRECRAWL_API_KEY?.startsWith('fc-') ? 'Valid' : 'Invalid',
    },
    AVALAI_API_KEY: {
      exists: !!process.env.AVALAI_API_KEY,
      length: process.env.AVALAI_API_KEY?.length || 0,
      format: process.env.AVALAI_API_KEY?.startsWith('aa-') ? 'Valid' : 'Invalid',
    },
    GOOGLE_GENERATIVE_AI_API_KEY: {
      exists: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      length: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
      format: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.startsWith('AIza') ? 'Valid' : 'Invalid',
    },
    GROQ_API_KEY: {
      exists: !!process.env.GROQ_API_KEY,
      length: process.env.GROQ_API_KEY?.length || 0,
    },
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  const issues: string[] = [];
  if (!envCheck.E2B_API_KEY.exists) issues.push('E2B_API_KEY missing');
  if (!envCheck.FIRECRAWL_API_KEY.exists) issues.push('FIRECRAWL_API_KEY missing');
  if (!envCheck.AVALAI_API_KEY.exists) issues.push('AVALAI_API_KEY missing');

  return NextResponse.json({
    status: issues.length === 0 ? 'healthy' : 'critical',
    environment: envCheck,
    issues: issues,
    message: issues.length === 0 ? 'All environment variables configured' : `${issues.length} critical issues found`,
  });
}