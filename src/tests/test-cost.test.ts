import { calculateCost } from "../llm/pricing/cost-calculator.js";
import { DEEPSEEK_V41_FLASH_PRICING } from "../llm/pricing/pricing.js";

const usage = {
  promptTokens: 885,
  completionTokens: 3980,
  cachedTokens: 768,
  reasoningTokens: 817,
};

const cost = calculateCost(usage, DEEPSEEK_V41_FLASH_PRICING);

console.log("Token usage:", usage);
console.log("Estimated actual cost:", cost.toFixed(4), "RUB");
