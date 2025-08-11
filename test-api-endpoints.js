import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const VERCEL_URL = process.env.VERCEL_URL || 'https://your-project.vercel.app';

const testResults = {
  timestamp: new Date().toISOString(),
  environment: 'local',
  tests: []
};

async function testEndpoint(name, method, endpoint, body = null, expectedStatus = 200) {
  const startTime = Date.now();
  console.log(`🧪 Testing ${name}...`);
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const duration = Date.now() - startTime;

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      // ignore non-JSON
    }
    
    const result = {
      name,
      endpoint,
      method,
      status: response.status,
      success: response.status === expectedStatus,
      duration,
      response: data,
      timestamp: new Date().toISOString()
    };
    
    testResults.tests.push(result);
    
    if (result.success) {
      console.log(`✅ ${name}: PASSED (${duration}ms)`);
    } else {
      console.log(`❌ ${name}: FAILED - Status ${response.status} (${duration}ms)`);
      if (data && data.error) console.log(`   Error: ${data.error}`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      name,
      endpoint,
      method,
      status: 'ERROR',
      success: false,
      duration,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    testResults.tests.push(result);
    console.log(`💥 ${name}: ERROR (${duration}ms) - ${error.message}`);
    return result;
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test 1: Environment Debug
  await testEndpoint(
    'Environment Debug',
    'GET',
    '/api/debug'
  );
  
  // Test 2: E2B Sandbox Creation
  await testEndpoint(
    'E2B Sandbox Creation',
    'POST',
    '/api/create-ai-sandbox',
    { template: 'nodejs' }
  );
  
  // Test 3: Firecrawl Screenshot
  await testEndpoint(
    'Firecrawl Screenshot',
    'POST',
    '/api/scrape-screenshot',
    { url: 'https://example.com' }
  );
  
  // Test 4: Firecrawl Enhanced Scraping
  await testEndpoint(
    'Firecrawl Enhanced Scraping',
    'POST',
    '/api/scrape-url-enhanced',
    { url: 'https://example.com' }
  );
  
  // Test 5: AI Code Generation (use avalai provider per codebase defaults)
  await testEndpoint(
    'AI Code Generation',
    'POST',
    '/api/generate-ai-code-stream',
    { 
      prompt: 'Write a simple "Hello World" function in JavaScript',
      model: 'avalai/gpt-5-mini'
    }
  );
  
  // Generate Summary
  const totalTests = testResults.tests.length;
  const passedTests = testResults.tests.filter(t => t.success).length;
  const failedTests = totalTests - passedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log('\n📊 TEST SUMMARY:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Success Rate: ${successRate}%`);
  
  testResults.summary = {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: parseFloat(successRate)
  };
  
  // Save results
  fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n💾 Results saved to test-results.json');
  
  return testResults;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, testEndpoint };