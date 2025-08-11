import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, manifest, model: requestedModel } = await request.json();
    
    console.log('[analyze-edit-intent] Request received');
    console.log('[analyze-edit-intent] Prompt:', prompt);
    
    if (!prompt || !manifest) {
      return NextResponse.json({
        success: false,
        error: 'prompt and manifest are required'
      }, { status: 400 });
    }
    
    // Create a summary of available files for the AI
    const validFiles = Object.entries(manifest.files as Record<string, any>)
      .filter(([path, info]) => {
        // Filter out invalid paths
        return path.includes('.') && !path.match(/\/\d+$/);
      });
    
    const fileSummary = validFiles
      .map(([path, info]: [string, any]) => {
        const componentName = info.componentInfo?.name || path.split('/').pop();
        const hasImports = info.imports?.length > 0;
        const childComponents = info.componentInfo?.childComponents?.join(', ') || 'none';
        return `- ${path} (${componentName}, renders: ${childComponents})`;
      })
      .join('\n');
    
    console.log('[analyze-edit-intent] Valid files found:', validFiles.length);
    
    if (validFiles.length === 0) {
      console.error('[analyze-edit-intent] No valid files found in manifest');
      return NextResponse.json({
        success: false,
        error: 'No valid files found in manifest'
      }, { status: 400 });
    }
    
    // Try AvalAI first
    const avalaiApiKey = process.env.AVALAI_API_KEY;
    if (avalaiApiKey) {
      try {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({
          apiKey: avalaiApiKey,
          baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
        });

        const response = await client.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert at planning code searches. Your job is to create a search strategy to find the exact code that needs to be edited.

DO NOT GUESS which files to edit. Instead, provide specific search terms that will locate the code.

SEARCH STRATEGY RULES:
1. For text changes (e.g., "change 'Start Deploying' to 'Go Now'"):
   - Search for the EXACT text: "Start Deploying"
   
2. For style changes (e.g., "make header black"):
   - Search for component names: "Header", "<header"
   - Search for class names: "header", "navbar"
   - Search for className attributes containing relevant words
   
3. For removing elements (e.g., "remove the deploy button"):
   - Search for the button text or aria-label
   - Search for relevant IDs or data-testids
   
4. For navigation/header issues:
   - Search for: "navigation", "nav", "Header", "navbar"
   - Look for Link components or href attributes
   
5. Be SPECIFIC:
   - Use exact capitalization for user-visible text
   - Include multiple search terms for redundancy
   - Add regex patterns for structural searches

Current project structure for context:
${fileSummary}

Respond with a JSON object containing:
{
  "editType": "UPDATE_COMPONENT|ADD_FEATURE|FIX_ISSUE|UPDATE_STYLE|REFACTOR|ADD_DEPENDENCY|REMOVE_ELEMENT",
  "reasoning": "explanation of the search strategy",
  "searchTerms": ["specific", "search", "terms"],
  "regexPatterns": ["optional", "regex", "patterns"],
  "fileTypesToSearch": [".jsx", ".tsx", ".js", ".ts"],
  "expectedMatches": 1
}`
            },
            {
              role: 'user',
              content: `User request: "${prompt}"

Create a search plan to find the exact code that needs to be modified. Include specific search terms and patterns.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          try {
            const searchPlan = JSON.parse(content);
            console.log('[analyze-edit-intent] Search plan created:', searchPlan);
            
            return NextResponse.json({
              success: true,
              searchPlan: searchPlan
            });
          } catch (parseError) {
            console.error('[analyze-edit-intent] Failed to parse response:', parseError);
          }
        }
      } catch (avalaiError) {
        console.log('[analyze-edit-intent] AvalAI failed, trying Google AI');
      }
    }
    
    // Fallback to Google AI
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (googleApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(googleApiKey);
        const googleModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await googleModel.generateContent(`
You are an expert at planning code searches. Your job is to create a search strategy to find the exact code that needs to be edited.

Current project structure for context:
${fileSummary}

User request: "${prompt}"

Create a search plan to find the exact code that needs to be modified. Include specific search terms and patterns.

Respond with a JSON object containing:
{
  "editType": "UPDATE_COMPONENT",
  "reasoning": "explanation of the search strategy",
  "searchTerms": ["specific", "search", "terms"],
  "regexPatterns": ["optional", "regex", "patterns"],
  "fileTypesToSearch": [".jsx", ".tsx", ".js", ".ts"],
  "expectedMatches": 1
}
        `);
        
        const response = await result.response;
        const content = response.text();
        
        try {
          const searchPlan = JSON.parse(content);
          console.log('[analyze-edit-intent] Search plan created (Google):', searchPlan);
          
          return NextResponse.json({
            success: true,
            searchPlan: searchPlan
          });
        } catch (parseError) {
          console.error('[analyze-edit-intent] Failed to parse Google response:', parseError);
        }
      } catch (googleError) {
        console.error('[analyze-edit-intent] Google AI failed:', googleError);
      }
    }
    
    // Fallback to simple keyword-based search
    const fallbackSearchPlan = {
      editType: 'UPDATE_COMPONENT',
      reasoning: 'Keyword-based search as fallback',
      searchTerms: [prompt.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3)],
      regexPatterns: [],
      fileTypesToSearch: ['.jsx', '.tsx', '.js', '.ts'],
      expectedMatches: 1
    };
    
    console.log('[analyze-edit-intent] Using fallback search plan');
    
    return NextResponse.json({
      success: true,
      searchPlan: fallbackSearchPlan
    });
    
  } catch (error) {
    console.error('[analyze-edit-intent] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}