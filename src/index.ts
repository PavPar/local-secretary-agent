
import "dotenv/config";

import { createInterface } from "node:readline/promises";
import { Agent } from "./agent/agent.js";

async function main() {
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const agent = new Agent();

  console.log("Local Agent started!");
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
        const response = await agent.run(input);

        console.log(`\nAgent: ${response}\n`);
      } catch (error) {
        console.error("\nAgent error:", error);
      }
    }
  } finally {
    terminal.close();
    console.log("Agent stopped.");
  }
}

await main();
