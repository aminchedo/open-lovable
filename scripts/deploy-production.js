import { execSync } from 'child_process';
import { setupProductionEnvironment } from './setup-production.js';

async function deployToProduction() {
  console.log('🚀 Starting production deployment process...\n');
  
  try {
    // Step 1: Setup environment
    console.log('📝 Step 1: Setting up environment variables...');
    const envSetup = await setupProductionEnvironment();
    if (!envSetup) {
      throw new Error('Environment setup failed');
    }
    
    // Step 2: Build and test locally
    console.log('\n🏗️  Step 2: Building project locally...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Local build successful');
    } catch (buildError) {
      console.error('❌ Local build failed:', buildError.message);
      throw new Error('Build failed - fix issues before deploying');
    }
    
    // Step 3: Deploy to production
    console.log('\n🚀 Step 3: Deploying to Vercel...');
    let deployOutput;
    try {
      deployOutput = execSync('vercel --prod --confirm', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ Deployment successful');
    } catch (deployError) {
      console.error('❌ Deployment failed:', deployError.message);
      throw new Error('Deployment failed');
    }
    
    // Extract deployment URL
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+\.vercel\.app/);
    const deploymentUrl = urlMatch ? urlMatch[0] : null;
    
    if (deploymentUrl) {
      console.log(`\n✅ Deployment successful!`);
      console.log(`🌐 URL: ${deploymentUrl}`);
      
      // Step 4: Test deployment
      console.log('\n🧪 Step 4: Testing deployment...');
      await testDeployment(deploymentUrl);
      
    } else {
      throw new Error('Could not extract deployment URL');
    }
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

async function testDeployment(url) {
  const tests = [
    { name: 'Health Check', endpoint: '/api/debug' },
    { name: 'E2B Sandbox', endpoint: '/api/create-ai-sandbox', method: 'POST', body: { template: 'nodejs' } }
  ];
  
  console.log(`\n🔍 Testing endpoints at ${url}...`);
  
  for (const test of tests) {
    try {
      console.log(`\n📋 Testing ${test.name}...`);
      
      const options = {
        method: test.method || 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(`${url}${test.endpoint}`, options);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${test.name}: PASSED (${response.status})`);
        if (test.name === 'Health Check' && data.status) {
          console.log(`   Status: ${data.status}`);
          if (data.issues && data.issues.length > 0) {
            console.log(`   Issues: ${data.issues.join(', ')}`);
          }
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.status})`);
        console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.log(`💥 ${test.name}: ERROR - ${error.message}`);
    }
  }
  
  console.log('\n🎉 Deployment testing complete!');
  console.log(`\n📊 Final Status:`);
  console.log(`   URL: ${url}`);
  console.log(`   Health Check: ${url}/api/debug`);
  console.log(`   API Status: ${url}/api/create-ai-sandbox`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  deployToProduction().catch(console.error);
}

export { deployToProduction };