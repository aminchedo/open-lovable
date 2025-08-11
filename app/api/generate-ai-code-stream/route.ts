import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[generate-ai-code-stream] Starting request');
  
  try {
    // Check if we have alternative AI APIs instead of Groq
    const avalaiApiKey = process.env.AVALAI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!avalaiApiKey && !groqApiKey) {
      return NextResponse.json(
        { error: 'No AI API keys configured. Need AVALAI_API_KEY or GROQ_API_KEY.' },
        { status: 500 }
      );
    }

 

 
export async function POST(request: NextRequest) {
  console.log('[generate-ai-code-stream] Starting request');
  
  try {
    // Check if we have alternative AI APIs instead of Groq
    const avalaiApiKey = process.env.AVALAI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!avalaiApiKey && !groqApiKey) {
      return NextResponse.json(
        { error: 'No AI API keys configured. Need AVALAI_API_KEY or GROQ_API_KEY.' },
        { status: 500 }
      );
    }

    const { prompt, model: requestedModel, context, isEdit = false } = await request.json();
    
    console.log('[generate-ai-code-stream] Received request:');
    console.log('[generate-ai-code-stream] - prompt:', prompt);
    console.log('[generate-ai-code-stream] - isEdit:', isEdit);
    const modelFromConfig = (process.env.DEFAULT_MODEL as string) || 'avalai/gpt-5-mini';
    const model = requestedModel || modelFromConfig;
    console.log('[generate-ai-code-stream] - model:', model);
    
    const fallbackOrder = ((appConfig as any).ai?.fallbackOrder as string[]) || [
      'avalai/gpt-5-mini',
      'avalai/gpt-4o-mini',
      'avalai/claude-4-opus',
      'avalai/o3-pro',
      'google/gemini-pro',
      'google/gemini-1.5-flash'
    ];
    console.log('[generate-ai-code-stream] - context.sandboxId:', context?.sandboxId);
    console.log('[generate-ai-code-stream] - context.currentFiles:', context?.currentFiles ? Object.keys(context.currentFiles) : 'none');
    console.log('[generate-ai-code-stream] - currentFiles count:', context?.currentFiles ? Object.keys(context.currentFiles).length : 0);
    
    // Initialize conversation state if not exists
    if (!global.conversationState) {
      global.conversationState = {
        conversationId: `conv-${Date.now()}`,
        startedAt: Date.now(),
        lastUpdated: Date.now(),
        context: {
          messages: [],
          edits: [],
          projectEvolution: { majorChanges: [] },
          userPreferences: {}
        }
      };
    }
    
    // Add user message to conversation history
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
      metadata: {
        sandboxId: context?.sandboxId
      }
    };
    global.conversationState.context.messages.push(userMessage);
    
    // Clean up old messages to prevent unbounded growth
    if (global.conversationState.context.messages.length > 20) {
      // Keep only the last 15 messages
      global.conversationState.context.messages = global.conversationState.context.messages.slice(-15);
      console.log('[generate-ai-code-stream] Trimmed conversation history to prevent context overflow');
    }
    
    // Clean up old edits
    if (global.conversationState.context.edits.length > 10) {
      global.conversationState.context.edits = global.conversationState.context.edits.slice(-8);
    }
    
    // Debug: Show a sample of actual file content
    if (context?.currentFiles && Object.keys(context.currentFiles).length > 0) {
      const firstFile = Object.entries(context.currentFiles)[0];
      console.log('[generate-ai-code-stream] - sample file:', firstFile[0]);
      console.log('[generate-ai-code-stream] - sample content preview:', 
        typeof firstFile[1] === 'string' ? firstFile[1].substring(0, 100) + '...' : 'not a string');
    }
    
     if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use AvalAI instead of Groq
    if (avalaiApiKey) {
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({
        apiKey: avalaiApiKey,
        baseURL: process.env.AVALAI_BASE_URL || 'https://api.avalai.ir/v1',
      });

      const response = await client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false,
      });

      return NextResponse.json({
        success: true,
        response: response.choices[0]?.message?.content || 'No response generated',
        model: model,
      });
    }

    // Fallback to Groq if available
    if (groqApiKey) {
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: groqApiKey });

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      });

      return NextResponse.json({
        success: true,
        response: response.choices[0]?.message?.content || 'No response generated',
        model: 'mixtral-8x7b-32768',
      });
    }

    return NextResponse.json(
      { error: 'No working AI API available' },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('[generate-ai-code-stream] Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'AI code generation failed', details: error.message },
      { status: 500 }
    );
  }
}