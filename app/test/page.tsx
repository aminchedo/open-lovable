'use client';

import React, { useState } from 'react';
import { ModelSelector } from '@/components/ModelSelector';
import { DEFAULT_MODEL } from '@/lib/ai-models';
import { PlayIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

interface TestResult {
  api: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  response?: any;
  duration?: number;
}

export default function TestPage() {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (api: string, result: Partial<TestResult>) => {
    setTestResults(prev => {
      const index = prev.findIndex(r => r.api === api);
      if (index >= 0) {
        prev[index] = { ...prev[index], ...result };
        return [...prev];
      } else {
        return [...prev, { api, status: 'pending', message: '', ...result }];
      }
    });
  };

  const testAPI = async (api: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    updateTestResult(api, { status: 'pending', message: 'Testing...' });
    
    try {
      const response = await testFn();
      const duration = Date.now() - startTime;
      
      if (response.success || response.status === 'healthy') {
        updateTestResult(api, { 
          status: 'success', 
          message: 'Success', 
          response, 
          duration 
        });
      } else {
        updateTestResult(api, { 
          status: 'error', 
          message: response.error || 'Failed', 
          response, 
          duration 
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateTestResult(api, { 
        status: 'error', 
        message: error.message, 
        duration 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test Environment Debug
    await testAPI('Environment Check', async () => {
      const response = await fetch('/api/debug');
      return await response.json();
    });

    // Test E2B Sandbox
    await testAPI('E2B Sandbox', async () => {
      const response = await fetch('/api/create-ai-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: 'nodejs' }),
      });
      return await response.json();
    });

    // Test Firecrawl Screenshot
    await testAPI('Firecrawl Screenshot', async () => {
      const response = await fetch('/api/scrape-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      });
      return await response.json();
    });

    // Test Firecrawl Enhanced
    await testAPI('Firecrawl Enhanced', async () => {
      const response = await fetch('/api/scrape-url-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      });
      return await response.json();
    });

    // Test AI Chat
    await testAPI(`AI Chat (${selectedModel})`, async () => {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'user', content: 'Say "API test successful" if you receive this message.' }
          ],
          maxTokens: 50,
        }),
      });
      return await response.json();
    });

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Open-Lovable API Test Dashboard</h1>
        <p className="text-gray-600">Test all API integrations and AI models</p>
      </div>
      
      {/* Model Selection */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Select AI Model for Testing</h2>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Test Controls */}
      <div className="mb-8">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <PlayIcon className="w-4 h-4" />
          <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
        </button>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Results</h2>
        
        {testResults.length === 0 && !isRunning && (
          <div className="text-center py-12 text-gray-500">
            <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Run All Tests" to start testing all APIs</p>
          </div>
        )}

        {testResults.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusClass(result.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <h3 className="font-medium">{result.api}</h3>
                  <p className="text-sm opacity-75">{result.message}</p>
                </div>
              </div>
              
              {result.duration && (
                <span className="text-xs opacity-75">{result.duration}ms</span>
              )}
            </div>
            
            {result.response && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium hover:text-blue-600">
                  View Response Data
                </summary>
                <pre className="mt-2 p-3 bg-black bg-opacity-5 rounded text-xs overflow-x-auto max-h-40">
                  {JSON.stringify(result.response, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}