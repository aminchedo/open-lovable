import { NextRequest, NextResponse } from 'next/server';

interface EnvStatus {
  exists: boolean;
  length: number;
  format: 'Valid' | 'Invalid' | 'Not Set';
  masked: string;
}

function checkEnvVar(varName: string, expectedPrefix?: string): EnvStatus {
  const value = process.env[varName];
  
  if (!value) {
    return {
      exists: false,
      length: 0,
      format: 'Not Set',
      masked: 'Not Set'
    };
  }
  
  const isValidFormat = expectedPrefix ? value.startsWith(expectedPrefix) : true;
  
  return {
    exists: true,
    length: value.length,
    format: isValidFormat ? 'Valid' : 'Invalid',
    masked: value.length > 8 ? 
      `${value.substring(0, 6)}...${value.substring(value.length - 4)}` : 
      'Set (too short to mask)'
  };
}

export async function GET(request: NextRequest) {
  console.log('[debug] Environment check requested');
  
  try {
    const envCheck = {
      E2B_API_KEY: checkEnvVar('E2B_API_KEY', 'E2b_'),
      FIRECRAWL_API_KEY: checkEnvVar('FIRECRAWL_API_KEY', 'fc-'),
      AVALAI_API_KEY: checkEnvVar('AVALAI_API_KEY', 'aa-'),
      AVALAI_BASE_URL: checkEnvVar('AVALAI_BASE_URL'),
      GOOGLE_GENERATIVE_AI_API_KEY: checkEnvVar('GOOGLE_GENERATIVE_AI_API_KEY', 'AIza'),
      GROQ_API_KEY: checkEnvVar('GROQ_API_KEY'),
      NODE_ENV: checkEnvVar('NODE_ENV')
    };
    
    // Identify issues
    const criticalVars = ['E2B_API_KEY', 'FIRECRAWL_API_KEY', 'AVALAI_API_KEY'];
    const issues = [];
    const warnings = [];
    
    for (const [varName, status] of Object.entries(envCheck)) {
      if (criticalVars.includes(varName)) {
        if (!status.exists) {
          issues.push(`${varName} is not set`);
        } else if (status.format === 'Invalid') {
          issues.push(`${varName} has invalid format`);
        }
      } else {
        if (!status.exists) {
          warnings.push(`${varName} is not set (optional)`);
        }
      }
    }
    
    const overallStatus = issues.length === 0 ? 'healthy' : 'critical';
    
    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      deployment: {
        platform: 'vercel',
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'localhost'
      },
      envVars: envCheck,
      issues: issues,
      warnings: warnings,
      recommendations: [
        ...issues.map(issue => `Fix: ${issue}`),
        issues.length === 0 ? 'All critical environment variables are properly configured' : null
      ].filter(Boolean)
    };
    
    console.log(`[debug] Environment status: ${overallStatus}`);
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('[debug] Error during environment check:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        error: 'Environment check failed',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}