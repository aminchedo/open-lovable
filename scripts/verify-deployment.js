import fetch from 'node-fetch';

// Default URL - can be overridden with command line argument
const DEFAULT_URL = 'https://open-lovable-ffafdryiy-dreammakers-projects-6bd02e6d.vercel.app';

async function verifyDeployment(deploymentUrl = DEFAULT_URL) {
  console.log('🔍 Verifying Deployment Status\n');
  console.log(`🌐 URL: ${deploymentUrl}\n`);
  
  // Test 1: Basic connectivity
  console.log('📋 Test 1: Basic Connectivity');
  try {
    const response = await fetch(deploymentUrl, { 
      method: 'GET',
      timeout: 10000 
    });
    
    if (response.ok) {
      console.log('✅ Basic connectivity: PASSED');
    } else {
      console.log(`❌ Basic connectivity: FAILED (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`💥 Basic connectivity: ERROR - ${error.message}`);
    return false;
  }
  
  // Test 2: Debug endpoint
  console.log('\n📋 Test 2: Debug Endpoint');
  try {
    const response = await fetch(`${deploymentUrl}/api/debug`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Debug endpoint: PASSED');
      console.log(`   Status: ${data.status}`);
      console.log(`   Environment: ${data.environment}`);
      
      if (data.issues && data.issues.length > 0) {
        console.log(`   Issues: ${data.issues.join(', ')}`);
      }
      
      if (data.recommendations && data.recommendations.length > 0) {
        console.log(`   Recommendations: ${data.recommendations.join(', ')}`);
      }
    } else {
      console.log(`❌ Debug endpoint: FAILED (${response.status})`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`💥 Debug endpoint: ERROR - ${error.message}`);
  }
  
  // Test 3: E2B Sandbox (if environment is healthy)
  console.log('\n📋 Test 3: E2B Sandbox Creation');
  try {
    const response = await fetch(`${deploymentUrl}/api/create-ai-sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: 'nodejs' })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ E2B Sandbox: PASSED');
      console.log(`   Sandbox ID: ${data.sandboxId}`);
    } else {
      console.log(`❌ E2B Sandbox: FAILED (${response.status})`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      console.log(`   Code: ${data.code || 'No code'}`);
    }
  } catch (error) {
    console.log(`💥 E2B Sandbox: ERROR - ${error.message}`);
  }
  
  // Test 4: Firecrawl Screenshot
  console.log('\n📋 Test 4: Firecrawl Screenshot');
  try {
    const response = await fetch(`${deploymentUrl}/api/scrape-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Firecrawl Screenshot: PASSED');
      console.log(`   URL: ${data.url}`);
    } else {
      console.log(`❌ Firecrawl Screenshot: FAILED (${response.status})`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      console.log(`   Code: ${data.code || 'No code'}`);
    }
  } catch (error) {
    console.log(`💥 Firecrawl Screenshot: ERROR - ${error.message}`);
  }
  
  console.log('\n📊 Verification Complete');
  console.log('========================');
  console.log('Next steps:');
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Redeploy: vercel --prod --confirm');
  console.log('3. Run verification again');
  
  return true;
}

// Get URL from command line argument
const url = process.argv[2] || DEFAULT_URL;

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDeployment(url).catch(console.error);
}

export { verifyDeployment };