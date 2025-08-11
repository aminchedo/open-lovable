import { execSync } from 'child_process';

const REQUIRED_ENV_VARS = {
  'E2B_API_KEY': 'E2b_59c8b95bd4c0b0cbb2aca709dee1adb38be2f7ea',
  'FIRECRAWL_API_KEY': 'fc-192ea47f3e7f4913bb7f61588bcad7ba',
  'AVALAI_API_KEY': 'aa-4jpbPW57MrwaTTMFJMqflwJC68cO2i3VeJvK7UG5Gsl6mWy4',
  'AVALAI_BASE_URL': 'https://api.avalai.ir/v1',
  'GOOGLE_GENERATIVE_AI_API_KEY': 'AIzaSyD_m8hatVazgotDmr83YPMahWPp5sX7nds',
  'NODE_ENV': 'production'
};

async function setupProductionEnvironment() {
  console.log('🔧 Setting up production environment...\n');
  
  // Check if vercel CLI is available
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI already installed');
  } catch (error) {
    console.error('❌ Vercel CLI not found. Installing...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed successfully');
    } catch (installError) {
      console.error('❌ Failed to install Vercel CLI:', installError.message);
      console.log('💡 Please install manually: npm install -g vercel');
      return false;
    }
  }
  
  // Check Vercel authentication
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ Already logged in to Vercel');
  } catch (error) {
    console.log('🔐 Vercel authentication required');
    console.log('Please run: vercel login');
    console.log('Then run this script again');
    return false;
  }
  
  console.log('\n📝 Environment Variables Setup');
  console.log('================================');
  console.log('\nThe following environment variables need to be set in your Vercel project:');
  
  for (const [key, value] of Object.entries(REQUIRED_ENV_VARS)) {
    console.log(`\n${key}:`);
    console.log(`  Value: ${value}`);
    console.log(`  Format: ${key.includes('_API_KEY') ? 'API Key' : 'URL/Text'}`);
  }
  
  console.log('\n📋 Manual Setup Instructions:');
  console.log('1. Go to your Vercel dashboard: https://vercel.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add each variable above');
  console.log('5. Set environment to "Production" and "Preview"');
  console.log('6. Save and redeploy');
  
  console.log('\n🚀 Alternative: Use Vercel CLI');
  console.log('Run these commands manually:');
  
  for (const [key, value] of Object.entries(REQUIRED_ENV_VARS)) {
    console.log(`vercel env add ${key} production`);
    console.log(`vercel env add ${key} preview`);
  }
  
  console.log('\n🎉 Setup instructions complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Set environment variables (see instructions above)');
  console.log('2. Run: node scripts/deploy-production.js');
  console.log('3. Or manually: vercel --prod --confirm');
  console.log('4. Test deployment: curl https://your-app.vercel.app/api/debug');
  
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionEnvironment().catch(console.error);
}

export { setupProductionEnvironment };