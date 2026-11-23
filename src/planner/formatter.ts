import type { ProjectPlan } from "./schemas.js";

function indent(text: string, spaces = 4): string {
  const prefix = " ".repeat(spaces);

  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

export function formatProjectPlan(plan: ProjectPlan): string {
  const lines: string[] = [];

  lines.push("=".repeat(70));
  lines.push(`ПРОЕКТ: ${plan.projectName}`);
  lines.push("=".repeat(70));

  lines.push("");
  lines.push("ОПИСАНИЕ");
  lines.push(plan.description);

  lines.push("");
  lines.push("ЦЕЛЬ ПОЛЬЗОВАТЕЛЯ");
  lines.push(plan.userGoal);

  lines.push("");
  lines.push("-".repeat(70));
  lines.push(`ПЛАН: ${plan.phases.length} этапов`);
  lines.push("-".repeat(70));

  let taskNumber = 0;

  for (const [phaseIndex, phase] of plan.phases.entries()) {
    lines.push("");
    lines.push(`ЭТАП ${phaseIndex + 1}: ${phase.name}`);
    lines.push(indent(phase.description));

    lines.push("");
    lines.push(`Задач: ${phase.tasks.length}`);

    for (const task of phase.tasks) {
      taskNumber++;

      lines.push("");
      lines.push(`  ${taskNumber}. ${task.title}`);
      lines.push("  " + "-".repeat(50));

      lines.push("");
      lines.push("  Описание и практика:");
      lines.push(indent(task.bodyMarkdown, 4));

      lines.push("");
      lines.push("  Ожидаемый результат:");
      lines.push(indent(task.expectedResult, 4));

      if (task.researchQueries.length > 0) {
        lines.push("");
        lines.push("  Запросы для исследования:");

        for (const query of task.researchQueries) {
          lines.push(`    - ${query}`);
        }
      }
    }

    lines.push("");
    lines.push("-".repeat(70));
  }

  lines.push("");
  lines.push(`ИТОГО: ${plan.phases.length} этапов, ${taskNumber} задач`);
  lines.push("=".repeat(70));

  return lines.join("\n");
}
