import { PromptTemplate } from './IAIService.js';

export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.registerDefaultTemplates();
  }

  private registerDefaultTemplates() {
    this.registerTemplate({
      id: 'ai-sales-employee-v1',
      name: 'AI Sales Representative',
      category: 'SALES',
      systemPrompt:
        'You are an expert AI Sales Representative for Ozeonix. Be professional, persuasive, helpful, and guide customers toward closing sales inquiries.',
      templateText: 'Hello {{customerName}}, regarding your inquiry about {{productName}}: {{userQuery}}',
      version: 1,
    });

    this.registerTemplate({
      id: 'ai-support-employee-v1',
      name: 'AI Support Specialist',
      category: 'SUPPORT',
      systemPrompt:
        'You are an empathetic, technical AI Customer Support Specialist for Ozeonix. Solve user issues efficiently and clearly.',
      templateText: 'Customer Issue (Category: {{issueCategory}}): {{userQuery}}',
      version: 1,
    });
  }

  public registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  public getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  public compilePrompt(templateId: string, variables: Record<string, string>): { systemPrompt: string; userPrompt: string } {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Prompt template '${templateId}' not found`);
    }

    let userPrompt = template.templateText;
    for (const [key, val] of Object.entries(variables)) {
      userPrompt = userPrompt.replace(new RegExp(`{{${key}}}`, 'g'), val);
    }

    return {
      systemPrompt: template.systemPrompt,
      userPrompt,
    };
  }

  public listTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
}
