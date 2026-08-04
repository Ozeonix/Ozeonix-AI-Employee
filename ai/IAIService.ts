export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'SALES' | 'SUPPORT' | 'MARKETING' | 'HR' | 'FINANCE' | 'GENERAL';
  systemPrompt: string;
  templateText: string;
  version: number;
}

export interface AIResponseOptions {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  tools?: ToolDefinition[];
  conversationId?: string;
}

export interface AIResponseResult {
  text: string;
  modelUsed: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  functionCalls?: { name: string; args: any }[];
  fallbackTriggered: boolean;
}

export interface IAIService {
  generateResponse(prompt: string, history: any[], options?: AIResponseOptions): Promise<AIResponseResult>;
  streamResponse(prompt: string, history: any[], onChunk: (text: string) => void, options?: AIResponseOptions): Promise<AIResponseResult>;
}
