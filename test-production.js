const PRODUCTION_URL = process.argv[2] || 'https://your-project.vercel.app';

async function testProduction() {
  console.log(`🌐 Testing production deployment: ${PRODUCTION_URL}\n`);
  
  const tests = [
    {
      name: 'Production Environment Debug',
      method: 'GET',
      endpoint: '/api/debug'
    },
    {
      name: 'Production E2B Sandbox',
      method: 'POST',
      endpoint: '/api/create-ai-sandbox',
      body: { template: 'nodejs' }
    },
    {
      name: 'Production Firecrawl Screenshot',
      method: 'POST',
      endpoint: '/api/scrape-screenshot',
      body: { url: 'https://example.com' }
    },
    {
      name: 'Production AI Generation',
      method: 'POST',
      endpoint: '/api/generate-ai-code-stream',
      body: { prompt: 'Hello world', model: 'avalai/gpt-5-mini' }
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testProductionEndpoint(
      test.name,
      test.method,
      test.endpoint,
      test.body
    );
    results.push(result);
  }
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(1);
  
  console.log('\n🏭 PRODUCTION TEST SUMMARY:');
  console.log(`Success Rate: ${successRate}% (${passed}/${total})`);
  
  if (Number(successRate) >= 75) {
    console.log('🎉 Production deployment is healthy!');
  } else {
    console.log('⚠️  Production deployment needs attention');
  }
  
  return results;
}

async function testProductionEndpoint(name, method, endpoint, body = null) {
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
    
    const response = await fetch(`${PRODUCTION_URL}${endpoint}`, options);
    const duration = Date.now() - startTime;

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      // ignore
    }
    
    const success = response.status >= 200 && response.status < 300;
    
    if (success) {
      console.log(`✅ ${name}: PASSED (${duration}ms)`);
    } else {
      console.log(`❌ ${name}: FAILED - Status ${response.status} (${duration}ms)`);
    }
    
    return {
      name,
      endpoint,
      status: response.status,
      success,
      duration,
      response: data
    };
  } catch (error) {
    console.log(`💥 ${name}: ERROR - ${error.message}`);
    return {
      name,
      endpoint,
      success: false,
      error: error.message
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testProduction().catch(console.error);
}

export { testProduction };