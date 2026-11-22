import OpenAI from "openai";

import type {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

import type { LLMChatOptions, LLMProvider } from "../types.js";

export class YandexProvider implements LLMProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, folderId: string, modelUri: string) {
    this.model = modelUri;

    this.client = new OpenAI({
      apiKey,
      baseURL: "https://ai.api.cloud.yandex.net/v1",
      project: folderId,
      timeout: 120_000,
      maxRetries: 0,
    });
  }

  async chat(
    messages: ChatCompletionMessageParam[],
    options: LLMChatOptions = {},
  ): Promise<ChatCompletion> {
    const { tools, jsonMode, maxTokens } = options;
    console.log("firing to yandex. waiting for response");
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
