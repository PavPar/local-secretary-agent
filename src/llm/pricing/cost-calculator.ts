import type { ModelPricing, TokenUsage } from "./types.js";

export function calculateCost(
  usage: TokenUsage,
  pricing: ModelPricing,
): number {
  const { promptTokens, completionTokens, cachedTokens } = usage;

  if (
    promptTokens < 0 ||
    completionTokens < 0 ||
    cachedTokens < 0 ||
    cachedTokens > promptTokens
  ) {
    throw new Error("Invalid token usage");
  }

  const regularInputTokens = promptTokens - cachedTokens;

  const regularInputCost = (regularInputTokens / 1000) * pricing.inputPer1k;

  const cachedInputCost = (cachedTokens / 1000) * pricing.cachedInputPer1k;

  const outputCost = (completionTokens / 1000) * pricing.outputPer1k;

  return regularInputCost + cachedInputCost + outputCost;
}
