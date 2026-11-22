export interface CostEstimate {
  inputTokens: number;
  estimatedOutputTokens: {
    min: number;
    expected: number;
    max: number;
  };
  estimatedCost: {
    min: number;
    expected: number;
    max: number;
  };
}
