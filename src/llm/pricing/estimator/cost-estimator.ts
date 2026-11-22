import type { ModelPricing } from "../types.js";
import type { CostEstimate } from "./types.js";

export interface CostEstimatorOptions {
  minOutputTokens: number;
  expectedOutputTokens: number;
  maxOutputTokens: number;
}

export class CostEstimator {
  constructor(private readonly pricing: ModelPricing) {}

  estimate(inputTokens: number, options: CostEstimatorOptions): CostEstimate {
    const { minOutputTokens, expectedOutputTokens, maxOutputTokens } = options;

    if (
      inputTokens < 0 ||
      minOutputTokens < 0 ||
      minOutputTokens > expectedOutputTokens ||
      expectedOutputTokens > maxOutputTokens
    ) {
      throw new Error("Invalid cost estimation parameters");
    }

    const calculate = (outputTokens: number): number => {
      const inputCost = (inputTokens / 1000) * this.pricing.inputPer1k;

      const outputCost = (outputTokens / 1000) * this.pricing.outputPer1k;

      return inputCost + outputCost;
    };

    return {
      inputTokens,
      estimatedOutputTokens: {
        min: minOutputTokens,
        expected: expectedOutputTokens,
        max: maxOutputTokens,
      },
      estimatedCost: {
        min: calculate(minOutputTokens),
        expected: calculate(expectedOutputTokens),
        max: calculate(maxOutputTokens),
      },
    };
  }
}
