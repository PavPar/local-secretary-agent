import OpenAI from "openai";

import type {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

import type { LLMChatOptions, LLMProvider, TokenEstimate } from "../types.js";

export class YandexProvider implements LLMProvider {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly apiKey: string;
  private readonly folderId: string;

  constructor(apiKey: string, folderId: string, modelUri: string) {
    this.model = modelUri;
    this.apiKey = apiKey;
    this.folderId = folderId;

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

  async estimateTokens(
    messages: ChatCompletionMessageParam[],
    options: LLMChatOptions = {},
  ): Promise<TokenEstimate> {
    const normalizedMessages = messages.map((message) => {
      if (typeof message.content !== "string") {
        throw new Error(
          "Yandex token estimation currently supports text messages only",
        );
      }

      return {
        role: message.role,
        text: message.content,
      };
    });

    const response = await fetch(
      "https://ai.api.cloud.yandex.net/foundationModels/v1/tokenizeCompletion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${this.apiKey}`,
          "OpenAI-Project": this.folderId,
        },
        body: JSON.stringify({
          modelUri: this.model,
          messages: normalizedMessages,
          ...(options.jsonMode ? { jsonObject: true } : {}),
          ...(options.maxTokens
            ? {
                completionOptions: {
                  maxTokens: String(options.maxTokens),
                },
              }
            : {}),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Yandex tokenization failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = (await response.json()) as {
      tokens?: unknown[];
    };

    if (!Array.isArray(result.tokens)) {
      throw new Error("Yandex tokenizer returned an invalid response");
    }

    return {
      inputTokens: result.tokens.length,
      accuracy: "exact",
    };
  }
}
