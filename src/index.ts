import "dotenv/config";

import { createInterface } from "node:readline/promises";
import { createLLMProvider } from "./llm/factory.js";
import { Planner } from "./planner/planner.js";
import { formatProjectPlan } from "./planner/formatter.js";

async function main() {
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Planner всегда использует Yandex.
  const plannerLLM = createLLMProvider("yandex");
  const planner = new Planner(plannerLLM);

  console.log("AI Planner started!");
  console.log("Введите exit для завершения.\n");

  try {
    while (true) {
      const input = await terminal.question("You: ");

      if (input.trim().toLowerCase() === "exit") {
        break;
      }

      if (!input.trim()) {
        continue;
      }

      try {
        const plan = await planner.generate(input);

        console.log("\n========== PROJECT PLAN ==========");
        console.log(formatProjectPlan(plan));
        console.log("==================================\n");
      } catch (error) {
        console.error("\nPlanner error:", error);
      }
    }
  } finally {
    terminal.close();
    console.log("Planner stopped.");
  }
}

await main();
