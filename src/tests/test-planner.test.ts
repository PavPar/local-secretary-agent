import "dotenv/config";

import { createLLMProvider } from "../llm/factory.js";
import { Planner } from "../planner/planner.js";

async function main() {
  const llm = createLLMProvider();
  const planner = new Planner(llm);
  console.log("\n=== START ===\n");

  const plan = await planner.generate(
    "Хочу план по создани hello world на python",
  );

  console.log("\n=== PROJECT PLAN ===\n");
  console.log(JSON.stringify(plan, null, 2));

  console.log("\n=== SUMMARY ===");
  console.log(`Project: ${plan.projectName}`);
  console.log(`Phases: ${plan.phases.length}`);

  const totalTasks = plan.phases.reduce(
    (total, phase) => total + phase.tasks.length,
    0,
  );

  console.log(`Tasks: ${totalTasks}`);
}

main().catch((error) => {
  console.error("Planner error:", error);
  process.exitCode = 1;
});
