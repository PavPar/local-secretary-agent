import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import type { LLMProvider } from "../llm/types.js";

import { ProjectPlanSchema, type ProjectPlan } from "./schemas.js";

import { PLANNER_SYSTEM_PROMPT } from "./prompts.js";
import { adaptTokenUsage } from "../llm/pricing/usage-adapter.js";

export class Planner {
  constructor(private readonly llm: LLMProvider) {}

  async generate(userRequest: string): Promise<ProjectPlan> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: PLANNER_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userRequest,
      },
    ];
    const response = await this.llm.chat(messages, {
      jsonMode: true,
      maxTokens: 8000,
    });
    const usage = adaptTokenUsage(response.usage);

    console.log("[Planner] Token usage:", usage);

    console.log("[Planner] Usage from yandex:", response.usage);
    console.log("[Planner] Finish reason:", response.choices[0]?.finish_reason);
    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new Error("LLM returned an empty response");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("[Planner] JSON parsing failed:", err);
      console.error(
        "[Planner] Finish reason:",
        response.choices[0]?.finish_reason,
      );
      console.error("[Planner] Response content:");
      console.error(content);

      throw new Error("LLM returned invalid JSON");
    }

    const validation = ProjectPlanSchema.safeParse(parsed);

    if (!validation.success) {
      console.error("[Planner] Validation errors:", validation.error.issues);

      console.error("[Planner] Raw response:", content);

      throw new Error("LLM returned an invalid project plan");
    }

    return validation.data;
  }
}
