#!/usr/bin/env node

// Test script to verify API fixes
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`\n🧪 Testing ${method} ${endpoint}...`);
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Fix Verification Tests...\n');
  
  // Test 1: Debug endpoint
  console.log('='.repeat(50));
  console.log('TEST 1: Debug Environment Variables');
  console.log('='.repeat(50));
  await testEndpoint('debug');
  
  // Test 2: Create AI Sandbox (should fail gracefully if no E2B key)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 2: Create AI Sandbox');
  console.log('='.repeat(50));
  await testEndpoint('create-ai-sandbox', 'POST', {
    template: 'nodejs'
  });
  
  // Test 3: Scrape Screenshot (should fail gracefully if no Firecrawl key)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 3: Scrape Screenshot');
  console.log('='.repeat(50));
  await testEndpoint('scrape-screenshot', 'POST', {
    url: 'https://example.com'
  });
  
  // Test 4: Scrape URL Enhanced (should fail gracefully if no Firecrawl key)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 4: Scrape URL Enhanced');
  console.log('='.repeat(50));
  await testEndpoint('scrape-url-enhanced', 'POST', {
    url: 'https://example.com'
  });
  
  // Test 5: Generate AI Code (should fail gracefully if no AI keys)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 5: Generate AI Code');
  console.log('='.repeat(50));
  await testEndpoint('generate-ai-code-stream', 'POST', {
    prompt: 'Create a simple React component',
    model: 'avalai/gpt-5-mini'
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!');
  console.log('='.repeat(50));
  console.log('\n📋 Expected Results:');
  console.log('- Debug endpoint should return environment status');
  console.log('- API endpoints should return proper error messages instead of 500 errors');
  console.log('- Error messages should be clear and actionable');
  console.log('\n🔧 Next Steps:');
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Redeploy the application');
  console.log('3. Run tests again to verify success');
}

runTests().catch(console.error);