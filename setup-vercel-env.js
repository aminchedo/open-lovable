import { execSync } from 'node:child_process';

const ENV_VARS = {
  'E2B_API_KEY': 'E2b_59c8b95bd4c0b0cbb2aca709dee1adb38be2f7ea',
  'FIRECRAWL_API_KEY': 'fc-192ea47f3e7f4913bb7f61588bcad7ba',
  'AVALAI_API_KEY': 'aa-4jpbPW57MrwaTTMFJMqflwJC68cO2i3VeJvK7UG5Gsl6mWy4',
  'AVALAI_BASE_URL': 'https://api.avalai.ir/v1',
  'GOOGLE_GENERATIVE_AI_API_KEY': 'AIzaSyD_m8hatVazgotDmr83YPMahWPp5sX7nds',
  'GROQ_API_KEY': 'gsk_placeholder_key_12345',
  'NODE_ENV': 'production'
};

function setupVercelEnvironment() {
  console.log('🔧 Setting up Vercel environment variables...\n');
  
  Object.entries(ENV_VARS).forEach(([key, value]) => {
    try {
      console.log(`Setting ${key}...`);
      execSync(`vercel env add ${key} production`, { 
        input: value + '\n',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      execSync(`vercel env add ${key} preview`, { 
        input: value + '\n',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      execSync(`vercel env add ${key} development`, { 
        input: value + '\n',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      console.log(`✅ ${key} set for all environments`);
    } catch (error) {
      console.log(`⚠️  ${key} may already exist or error occurred`);
    }
  });
  
  console.log('\n✅ Environment variables setup complete!');
  console.log('🚀 You can now deploy with: vercel --prod');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupVercelEnvironment();
}

export { setupVercelEnvironment, ENV_VARS };