#!/usr/bin/env node

/**
 * Simple test for Smart AI Client
 */

import { smartAIClient } from './lib/smart-ai-client.ts';

async function testSimple() {
  console.log('🧠 Testing Smart AI Client...\n');
  
  try {
    console.log('📝 Testing with simple prompt...');
    const response = await smartAIClient.getAIResponse(
      'Say hello in one sentence',
      'avalai/gpt-5-mini',
      'general-chat'
    );
    
    console.log('✅ Response received:');
    console.log('Model:', response.model);
    console.log('Tier:', response.tier);
    console.log('Provider:', response.provider);
    console.log('Has response:', !!response.response);
    console.log('Response keys:', Object.keys(response.response));
    console.log('Has textStream:', 'textStream' in response.response);
    
    // Try to read the response
    let text = '';
    for await (const chunk of response.response.textStream) {
      text += chunk;
    }
    console.log('Response text:', text);
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Error details:', error);
  }
}

// Run the test
testSimple().catch(console.error);