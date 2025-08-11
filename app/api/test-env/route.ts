import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envVars = {
    E2B_API_KEY: process.env.E2B_API_KEY ? `${process.env.E2B_API_KEY.substring(0, 10)}...` : 'NOT_SET',
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY ? `${process.env.FIRECRAWL_API_KEY.substring(0, 10)}...` : 'NOT_SET',
    AVALAI_API_KEY: process.env.AVALAI_API_KEY ? `${process.env.AVALAI_API_KEY.substring(0, 10)}...` : 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
    VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_SET',
    VERCEL_URL: process.env.VERCEL_URL || 'NOT_SET'
  };

  return NextResponse.json({
    success: true,
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}