import OpenAI from "openai";

import type { LLMChatOptions, LLMProvider, TokenEstimate } from "../types.js";
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources";

export class OllamaProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(baseURL: string, model: string) {
    this.model = model;

    this.client = new OpenAI({
      baseURL,
      apiKey: "ollama",
      timeout: 120_000,
      maxRetries: 0,
    });
  }
  estimateTokens(
    messages: ChatCompletionMessageParam[],
    options?: LLMChatOptions,
  ): Promise<TokenEstimate> {
    throw new Error("Method not implemented.");
  }

  async chat(
    messages: ChatCompletionMessageParam[],
    options: LLMChatOptions = {},
  ): Promise<ChatCompletion> {
    const { tools, jsonMode, maxTokens } = options;

    return this.client.chat.completions.create({
      model: this.model,
      messages,
      tools,
      tool_choice: tools ? "auto" : "none",
      temperature: 0.2,

      ...(jsonMode
        ? {
            response_format: {
              type: "json_object" as const,
            },
          }
        : {}),

      ...(maxTokens ? { max_tokens: maxTokens } : {}),
    });
  }
}
