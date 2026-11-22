import type { ChatCompletion } from "openai/resources/chat/completions";

import type { TokenUsage } from "./types.js";

export function adaptTokenUsage(usage: ChatCompletion["usage"]): TokenUsage {
  if (!usage) {
    throw new Error("LLM response does not contain token usage");
  }

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    cachedTokens: usage.prompt_tokens_details?.cached_tokens ?? 0,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens ?? 0,
  };
}
