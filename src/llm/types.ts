import {
  ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

export interface LLMChatOptions {
  tools?: ChatCompletionTool[];
  jsonMode?: boolean;
  maxTokens?: number;
}

export interface LLMProvider {
  chat(
    messages: ChatCompletionMessageParam[],
    options?: LLMChatOptions,
  ): Promise<ChatCompletion>;
}
