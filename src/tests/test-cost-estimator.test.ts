import { CostEstimator } from "../llm/pricing/estimator/cost-estimator.js";
import { DEEPSEEK_V41_FLASH_PRICING } from "../llm/pricing/pricing.js";

const estimator = new CostEstimator(DEEPSEEK_V41_FLASH_PRICING);

const result = estimator.estimate(864, {
  minOutputTokens: 1000,
  expectedOutputTokens: 2000,
  maxOutputTokens: 3000,
});

console.log(result);
