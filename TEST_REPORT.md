# 🧪 API Test Report
  
## Test Summary
- **Timestamp**: 2025-08-11T19:54:39.494Z
- **Total Tests**: 5
- **Passed**: 3 ✅
- **Failed**: 2 ❌
- **Success Rate**: 60%

## Individual Test Results


### Environment Debug
- **Endpoint**: `GET /api/debug`
- **Status**: ✅ PASSED
- **Response Time**: 233ms
- **HTTP Status**: 200


**Response**: ```json
{
  "status": "healthy",
  "environment": {
    "E2B_API_KEY": {
      "exists": true,
      "length": 44,
      "format": "Valid"
    },
    "FIRECRAWL_API_KEY": {
      "exists": true,
      "length": 35,
      "format": "Valid"
    },
    "AVALAI_API_KEY": {
      "exists": true,
      "length": 51,
      "format": "Valid"
    },
    "GOOGLE_GENERATIVE_AI_API_KEY": {
      "exists": true,
      "length": 39,
      "format": "Valid"
    },
    "GROQ_API_KEY": {
      "exists": true,
      "length": 25
    },
    "NODE_ENV": "development",
    "timestamp": "2025-08-11T19:54:39.727Z"
  },
  "issues": [],
  "message": "All environment variables configured"
}
```


### E2B Sandbox Creation
- **Endpoint**: `POST /api/create-ai-sandbox`
- **Status**: ❌ FAILED
- **Response Time**: 498ms
- **HTTP Status**: 401


**Response**: ```json
{
  "error": "Invalid E2B API key. Check environment variables."
}
```


### Firecrawl Screenshot
- **Endpoint**: `POST /api/scrape-screenshot`
- **Status**: ❌ FAILED
- **Response Time**: 532ms
- **HTTP Status**: 500


**Response**: ```json
{
  "error": "Screenshot failed",
  "details": "Failed to scrape URL. Status code: 400. Error: Bad Request - [{\"code\":\"custom\",\"message\":\"You may only specify either screenshot or screenshot@fullPage\",\"path\":[\"formats\"]}]"
}
```


### Firecrawl Enhanced Scraping
- **Endpoint**: `POST /api/scrape-url-enhanced`
- **Status**: ✅ PASSED
- **Response Time**: 4970ms
- **HTTP Status**: 200


**Response**: ```json
{
  "success": true,
  "data": {
    "success": true,
    "markdown": "Example Domain",
    "metadata": {
      "viewport": "width=device-width, initial-scale=1",
      "title": "Example Domain",
      "scrapeId": "2e824880-6d24-4181-8886-6958cd0e130c",
      "sourceURL": "https://example.com",
      "url": "https://example.com/",
      "statusCode": 200,
      "contentType": "text/html",
      "proxyUsed": "basic",
      "creditsUsed": 1
    },
    "html": "<html><body><div><title>Example Domain</title></div></body></html>"
  },
  "url": "https://example.com"
}
```


### AI Code Generation
- **Endpoint**: `POST /api/generate-ai-code-stream`
- **Status**: ✅ PASSED
- **Response Time**: 374ms
- **HTTP Status**: 200





## Recommendations

⚠️ Some tests are failing. Check the errors above and fix the issues.

---
Generated on 2025-08-11T20:42:03.348Z
