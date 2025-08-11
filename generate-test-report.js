import fs from 'fs';

function generateTestReport() {
  const testData = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
  
  const report = `# 🧪 API Test Report
  
## Test Summary
- **Timestamp**: ${testData.timestamp}
- **Total Tests**: ${testData.summary.total}
- **Passed**: ${testData.summary.passed} ✅
- **Failed**: ${testData.summary.failed} ❌
- **Success Rate**: ${testData.summary.successRate}%

## Individual Test Results

${testData.tests.map(test => `
### ${test.name}
- **Endpoint**: \`${test.method} ${test.endpoint}\`
- **Status**: ${test.success ? '✅ PASSED' : '❌ FAILED'}
- **Response Time**: ${test.duration}ms
- **HTTP Status**: ${test.status}

${test.error ? `**Error**: ${test.error}` : ''}
${test.response ? `**Response**: \`\`\`json\n${JSON.stringify(test.response, null, 2)}\n\`\`\`` : ''}
`).join('\n')}

## Recommendations

${testData.summary.successRate >= 90 ? 
  '🎉 All tests are passing! The API is ready for production.' : 
  '⚠️ Some tests are failing. Check the errors above and fix the issues.'}

---
Generated on ${new Date().toISOString()}
`;

  fs.writeFileSync('TEST_REPORT.md', report);
  console.log('📄 Test report generated: TEST_REPORT.md');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateTestReport();
}

export { generateTestReport };