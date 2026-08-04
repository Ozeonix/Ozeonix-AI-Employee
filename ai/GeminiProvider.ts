import { IAIService, AIResponseOptions, AIResponseResult } from './IAIService.js';
import { logger } from '../backend/src/config/logger.js';

export class GeminiProvider implements IAIService {
  private defaultModel = 'gemini-1.5-pro';
  private fallbackModel = 'gemini-1.5-flash';

  public async generateResponse(
    prompt: string,
    history: any[] = [],
    options: AIResponseOptions = {}
  ): Promise<AIResponseResult> {
    const selectedModel = options.modelName || this.defaultModel;
    let fallbackTriggered = false;

    try {
      logger.info(`🤖 Generating AI Response using ${selectedModel} (History Length: ${history.length})`);

      // Calculate simulated token metrics
      const promptTokens = Math.ceil(prompt.length / 4) + history.reduce((acc, h) => acc + Math.ceil(h.content.length / 4), 0);
      const simulatedText = `[AI Employee Response (${selectedModel})]: Thank you for reaching out to Ozeonix! I have processed your inquiry: "${prompt}". How may I assist your business further?`;
      const completionTokens = Math.ceil(simulatedText.length / 4);

      // Tool / Function calling simulation (Prompt 36)
      let functionCalls;
      if (options.tools && options.tools.length > 0) {
        functionCalls = [
          {
            name: options.tools[0].name,
            args: { query: prompt, timestamp: new Date().toISOString() },
          },
        ];
      }

      return {
        text: simulatedText,
        modelUsed: selectedModel,
        tokenUsage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        functionCalls,
        fallbackTriggered: false,
      };
    } catch (err: any) {
      logger.warn(`⚠️ Primary Model (${selectedModel}) failed: ${err.message}. Triggering Fallback to ${this.fallbackModel}...`);
      fallbackTriggered = true;

      // Fallback Handling (Prompt 37)
      const promptTokens = Math.ceil(prompt.length / 4);
      const fallbackText = `[AI Employee Response (${this.fallbackModel} Fallback)]: I am assisting you via our high-reliability fallback system. Re: "${prompt}"`;
      const completionTokens = Math.ceil(fallbackText.length / 4);

      return {
        text: fallbackText,
        modelUsed: this.fallbackModel,
        tokenUsage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        fallbackTriggered: true,
      };
    }
  }

  public async streamResponse(
    prompt: string,
    history: any[] = [],
    onChunk: (text: string) => void,
    options: AIResponseOptions = {}
  ): Promise<AIResponseResult> {
    const result = await this.generateResponse(prompt, history, options);
    const words = result.text.split(' ');

    for (const word of words) {
      onChunk(`${word} `);
      await new Promise((res) => setTimeout(res, 50)); // Simulating streaming chunk intervals
    }

    return result;
  }
}
