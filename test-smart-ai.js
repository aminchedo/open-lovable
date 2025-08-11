#!/usr/bin/env node

/**
 * Test script for Smart AI Integration
 * Tests the free-first, premium backup strategy
 */

const { smartAIClient, getModelDisplayName, isFreeModel, isPremiumModel } = require('./lib/smart-ai-client.ts');

async function testSmartAI() {
  console.log('🧠 Testing Smart AI Integration...\n');
  
  // Test 1: Get all available models
  console.log('📋 Available Models:');
  const allModels = smartAIClient.getAllModels();
  Object.entries(allModels).forEach(([group, models]) => {
    console.log(`\n${group}:`);
    models.forEach(model => {
      const tier = isFreeModel(model) ? '🆓' : '💎';
      console.log(`  ${tier} ${getModelDisplayName(model)}`);
    });
  });
  
  // Test 2: Test free model first
  console.log('\n🆓 Testing Free Model (Gemini Pro)...');
  try {
    const response = await smartAIClient.getAIResponse(
      'Create a simple React button component with hover effects',
      'gemini-pro',
      'code-generation'
    );
    console.log(`✅ Success with ${response.model} (${response.tier})`);
    console.log(`📝 Response preview: ${response.response.text.substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Free model failed: ${error.message}`);
  }
  
  // Test 3: Test premium fallback
  console.log('\n💎 Testing Premium Model (GPT-5 Mini)...');
  try {
    const response = await smartAIClient.getAIResponse(
      'Explain how React hooks work with examples',
      'avalai/gpt-5-mini',
      'general-chat'
    );
    console.log(`✅ Success with ${response.model} (${response.tier})`);
    console.log(`📝 Response preview: ${response.response.text.substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Premium model failed: ${error.message}`);
  }
  
  // Test 4: Test automatic fallback
  console.log('\n🔄 Testing Automatic Fallback...');
  try {
    const response = await smartAIClient.getAIResponse(
      'Create a complex dashboard component with charts',
      'invalid-model', // This should trigger fallback
      'complex-tasks'
    );
    console.log(`✅ Fallback successful with ${response.model} (${response.tier})`);
    console.log(`📝 Response preview: ${response.response.text.substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ All models failed: ${error.message}`);
  }
  
  // Test 5: Get model statistics
  console.log('\n📊 Model Statistics:');
  const stats = smartAIClient.getModelStats();
  Object.entries(stats).forEach(([model, data]) => {
    const status = data.success ? '✅' : '❌';
    console.log(`  ${status} ${model}: ${data.errorCount} errors, last used: ${new Date(data.lastUsed).toLocaleTimeString()}`);
  });
  
  console.log('\n🎉 Smart AI Integration Test Complete!');
}

// Run the test
testSmartAI().catch(console.error);