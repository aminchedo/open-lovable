#!/usr/bin/env node

/**
 * Test script to understand AI SDK response structure
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

async function testAIResponse() {
  console.log('🧠 Testing AI SDK Response Structure...\n');
  
  // Test Google AI
  try {
    const googleAI = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'AIzaSyD_m8hatVazgotDmr83YPMahWPp5sX7nds',
    });
    
    console.log('📝 Testing Google AI response...');
    const result = await streamText({
      model: googleAI['gemini-pro'],
      prompt: 'Say hello in one sentence',
      maxTokens: 100,
      temperature: 0.7,
    });
    
    console.log('✅ Google AI Response Structure:');
    console.log('Type:', typeof result);
    console.log('Keys:', Object.keys(result));
    console.log('Has textStream:', 'textStream' in result);
    console.log('Has text:', 'text' in result);
    
    // Try to read the response
    let responseText = '';
    for await (const chunk of result.textStream) {
      responseText += chunk;
    }
    console.log('Response text:', responseText);
    
  } catch (error) {
    console.log('❌ Google AI failed:', error.message);
  }
  
  // Test AvalAI
  try {
    const avalaiClient = createOpenAI({
      apiKey: process.env.AVALAI_API_KEY || 'aa-4jpbPW57MrwaTTMFJMqflwJC68cO2i3VeJvK7UG5Gsl6mWy4',
      baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
    });
    
    console.log('\n📝 Testing AvalAI response...');
    const result = await streamText({
      model: avalaiClient.chat('gpt-4o-mini'),
      messages: [{ role: 'user', content: 'Say hello in one sentence' }],
      maxTokens: 100,
      temperature: 0.7,
    });
    
    console.log('✅ AvalAI Response Structure:');
    console.log('Type:', typeof result);
    console.log('Keys:', Object.keys(result));
    console.log('Has textStream:', 'textStream' in result);
    console.log('Has text:', 'text' in result);
    
    // Try to read the response
    let responseText = '';
    for await (const chunk of result.textStream) {
      responseText += chunk;
    }
    console.log('Response text:', responseText);
    
  } catch (error) {
    console.log('❌ AvalAI failed:', error.message);
  }
}

// Run the test
testAIResponse().catch(console.error);