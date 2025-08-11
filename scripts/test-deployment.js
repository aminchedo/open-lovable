import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://open-lovable-ffafdryiy-dreammakers-projects-6bd02e6d.vercel.app';

async function testDeployment() {
  console.log('🧪 Testing Production Deployment\n');
  console.log(`🌐 URL: ${PRODUCTION_URL}\n`);
  
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/api/debug',
      method: 'GET',
      expectedStatus: 200,
      validate: (data) => data.status === 'healthy'
    },
    {
      name: 'E2B Sandbox Creation',
      endpoint: '/api/create-ai-sandbox',
      method: 'POST',
      body: { template: 'nodejs' },
      expectedStatus: 200,
      validate: (data) => data.success === true && data.sandboxId
    },
    {
      name: 'Firecrawl Screenshot',
      endpoint: '/api/scrape-screenshot',
      method: 'POST',
      body: { url: 'https://example.com' },
      expectedStatus: 200,
      validate: (data) => data.success === true && data.screenshot
    }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      console.log(`📋 Testing: ${test.name}`);
      
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(`${PRODUCTION_URL}${test.endpoint}`, options);
      const data = await response.json();
      
      if (response.status === test.expectedStatus) {
        if (test.validate && test.validate(data)) {
          console.log(`✅ ${test.name}: PASSED`);
          passedTests++;
        } else {
          console.log(`❌ ${test.name}: FAILED - Validation failed`);
          console.log(`   Response:`, JSON.stringify(data, null, 2));
        }
      } else {
        console.log(`❌ ${test.name}: FAILED - Status ${response.status}`);
        console.log(`   Expected: ${test.expectedStatus}, Got: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));
      }
      
    } catch (error) {
      console.log(`💥 ${test.name}: ERROR - ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Deployment is healthy.');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Check the deployment.');
    return false;
  }
}

// Additional utility functions
async function checkEnvironmentStatus() {
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/debug`);
    const data = await response.json();
    
    console.log('\n🔍 Environment Status:');
    console.log('=====================');
    console.log(`Status: ${data.status}`);
    console.log(`Environment: ${data.environment}`);
    console.log(`Platform: ${data.deployment?.platform}`);
    console.log(`Region: ${data.deployment?.region}`);
    
    if (data.issues && data.issues.length > 0) {
      console.log('\n❌ Issues Found:');
      data.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (data.warnings && data.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      data.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (data.recommendations && data.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      data.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    return data.status === 'healthy';
  } catch (error) {
    console.error('❌ Failed to check environment status:', error.message);
    return false;
  }
}

async function runFullTest() {
  console.log('🚀 Running Full Deployment Test Suite\n');
  
  // Check environment first
  const envHealthy = await checkEnvironmentStatus();
  
  if (!envHealthy) {
    console.log('\n❌ Environment check failed. Stopping tests.');
    return false;
  }
  
  // Run API tests
  const testsPassed = await testDeployment();
  
  return envHealthy && testsPassed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const testType = process.argv[2];
  
  switch (testType) {
    case 'env':
      checkEnvironmentStatus();
      break;
    case 'full':
      runFullTest();
      break;
    default:
      testDeployment();
  }
}

export { testDeployment, checkEnvironmentStatus, runFullTest };