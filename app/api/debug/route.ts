import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasE2B: !!process.env.E2B_API_KEY,
    hasFirecrawl: !!process.env.FIRECRAWL_API_KEY,
    hasAvalai: !!process.env.AVALAI_API_KEY,
    hasGoogle: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    e2bKeyLength: process.env.E2B_API_KEY?.length || 0,
    firecrawlKeyLength: process.env.FIRECRAWL_API_KEY?.length || 0,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}