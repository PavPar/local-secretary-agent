import type {
  ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

export interface LLMChatOptions {
  tools?: ChatCompletionTool[];
  jsonMode?: boolean;
  maxTokens?: number;
}

export interface TokenEstimate {
  inputTokens: number;
  accuracy: "exact" | "approximate";
}

export interface LLMProvider {
  chat(
    messages: ChatCompletionMessageParam[],
    options?: LLMChatOptions,
  ): Promise<ChatCompletion>;

  estimateTokens(
    messages: ChatCompletionMessageParam[],
    options?: LLMChatOptions,
  ): Promise<TokenEstimate>;
}
