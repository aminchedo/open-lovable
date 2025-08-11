import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { FileManifest } from '@/types/file-manifest';
import { smartAIClient, getModelDisplayName } from '@/lib/smart-ai-client';

// Smart AI client handles all providers with automatic fallback

// Schema for the AI's search plan - not file selection!
const searchPlanSchema = z.object({
  editType: z.enum([
    'UPDATE_COMPONENT',
    'ADD_FEATURE', 
    'FIX_ISSUE',
    'UPDATE_STYLE',
    'REFACTOR',
    'ADD_DEPENDENCY',
    'REMOVE_ELEMENT'
  ]).describe('The type of edit being requested'),
  
  reasoning: z.string().describe('Explanation of the search strategy'),
  
  searchTerms: z.array(z.string()).describe('Specific text to search for (case-insensitive). Be VERY specific - exact button text, class names, etc.'),
  
  regexPatterns: z.array(z.string()).optional().describe('Regex patterns for finding code structures (e.g., "className=[\\"\\\'].*header.*[\\"\\\']")'),
  
  fileTypesToSearch: z.array(z.string()).default(['.jsx', '.tsx', '.js', '.ts']).describe('File extensions to search'),
  
  expectedMatches: z.number().min(1).max(10).default(1).describe('Expected number of matches (helps validate search worked)'),
  
  fallbackSearch: z.object({
    terms: z.array(z.string()),
    patterns: z.array(z.string()).optional()
  }).optional().describe('Backup search if primary fails')
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, manifest, model = 'gemini-pro' } = await request.json();
    
    console.log('[analyze-edit-intent] Request received');
    console.log('[analyze-edit-intent] Prompt:', prompt);
    console.log('[analyze-edit-intent] Model:', model);
    console.log('[analyze-edit-intent] Manifest files count:', manifest?.files ? Object.keys(manifest.files).length : 0);
    
    if (!prompt || !manifest) {
      return NextResponse.json({
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
    
    console.log('[analyze-edit-intent] Analyzing prompt:', prompt);
    console.log('[analyze-edit-intent] File summary preview:', fileSummary.split('\n').slice(0, 5).join('\n'));
    
    // Use Smart AI Client with automatic fallback
    console.log('[analyze-edit-intent] Using Smart AI Client with model:', model);
    
    try {
      // Use AI to create a search plan with smart fallback
      const aiResponse = await smartAIClient.getAIResponse(
        `You are an expert at planning code searches. Your job is to create a search strategy to find the exact code that needs to be edited.

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

User request: "${prompt}"

Create a search plan to find the exact code that needs to be modified. Include specific search terms and patterns.

Please respond with a JSON object that matches this schema:
{
  "editType": "UPDATE_COMPONENT|ADD_FEATURE|FIX_ISSUE|UPDATE_STYLE|REFACTOR|ADD_DEPENDENCY|REMOVE_ELEMENT",
  "reasoning": "explanation of the search strategy",
  "searchTerms": ["specific", "search", "terms"],
  "regexPatterns": ["optional", "regex", "patterns"],
  "fileTypesToSearch": [".jsx", ".tsx", ".js", ".ts"],
  "expectedMatches": 1,
  "fallbackSearch": {
    "terms": ["backup", "search", "terms"],
    "patterns": ["backup", "patterns"]
  }
}`,
        model,
        'code-generation',
        {
          maxTokens: 2000,
          temperature: 0.3
        }
      );
      
      console.log('[analyze-edit-intent] AI response received from model:', aiResponse.model);
      
      // Parse the AI response as JSON
      let searchPlan;
      try {
        const responseText = await aiResponse.response.text;
        searchPlan = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[analyze-edit-intent] Failed to parse AI response as JSON:', parseError);
        throw new Error('AI response could not be parsed as valid JSON');
      }
      
      // Validate the search plan against the schema
      const validatedPlan = searchPlanSchema.parse(searchPlan);
      
      console.log('[analyze-edit-intent] Search plan created:', {
        editType: validatedPlan.editType,
        searchTerms: validatedPlan.searchTerms,
        patterns: validatedPlan.regexPatterns?.length || 0,
        reasoning: validatedPlan.reasoning,
        model: aiResponse.model,
        tier: aiResponse.tier
      });
      
      // Return the search plan, not file matches
      return NextResponse.json({
        success: true,
        searchPlan: validatedPlan,
        model: aiResponse.model,
        tier: aiResponse.tier,
        provider: aiResponse.provider
      });
      
    } catch (aiError) {
      console.error('[analyze-edit-intent] AI error:', aiError);
      return NextResponse.json({
        success: false,
        error: 'AI service unavailable. Please try again later.',
        details: (aiError as Error).message
      }, { status: 503 });
    }
      
    
  } catch (error) {
    console.error('[analyze-edit-intent] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}