export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  reasoningTokens: number;
}

export interface ModelPricing {
  inputPer1k: number;
  cachedInputPer1k: number;
  outputPer1k: number;
}
