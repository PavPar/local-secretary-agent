import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { OllamaClient } from "../llm/ollama.js";
import { ScrumboyClient } from "../scrumboy/client.js";
import { ToolRegistry, tools } from "../tools/index.js";

export class Agent {
  private readonly ollama: OllamaClient;
  private readonly scrumboy: ScrumboyClient;
  private readonly registry: ToolRegistry;

  private readonly messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
      Ты локальный AI-агент, работающий с Scrumboy.
      Общайся на русском языке.
      
      ДОСТУПНЫЕ ИНСТРУМЕНТЫ:
      - projects_list — получить список проектов.
      - me_get — получить информацию о пользователе.
      - todos_create — создать задачу.
      
      ПРАВИЛА:
      1. Всегда учитывай всю историю диалога.
      2. Если пользователь указал название задачи, запомни его.
      3. Если пользователь уточняет ранее запрошенную информацию,
      объединяй её с первоначальным запросом.
      4. Не спрашивай повторно информацию, которая уже есть в истории.
      5. Для создания задачи нужны projectSlug и title.
      6. Если projectSlug неизвестен, вызови projects_list.
      7. Если title и projectSlug известны, сразу вызывай todos_create.
      8. Не выдумывай параметры и результаты инструментов.
      9. Сообщай об успешном создании только после ответа Scrumboy.
      10. Если пользователь допустил опечатку в описании задачи или названии задачи - исправь
    `,
    },
  ];

  constructor() {
    this.ollama = new OllamaClient();
    this.scrumboy = new ScrumboyClient();
    this.registry = new ToolRegistry(this.scrumboy);
  }

  async run(userInput: string): Promise<string> {
    this.messages.push({
      role: "user",
      content: userInput,
    });
    console.log(`Запуск задачи.`);
    for (let iteration = 0; iteration < 5; iteration++) {
      console.log(`Итерация #${iteration}`);
      const start = performance.now();

      const response = await this.ollama.chat(this.messages, tools);

      const elapsed = ((performance.now() - start) / 1000).toFixed(2);

      console.log(`[Agent] LLM response: ${elapsed}s`);

      const message = response.choices[0].message;

      this.messages.push(message);

      if (!message.tool_calls?.length) {
        console.log("[Agent] Ответ модели:", message.content);
        console.log(
          "[Agent] Tool calls:",
          JSON.stringify(message.tool_calls, null, 2),
        );
        return message.content ?? "Модель не вернула текстовый ответ.";
      }

      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function") {
          continue;
        }

        const name = toolCall.function.name;

        const arguments_ = JSON.parse(
          toolCall.function.arguments || "{}",
        ) as Record<string, unknown>;

        console.log(`\n[Agent] Вызываю инструмент: ${name}`);
        console.log("[Agent] Аргументы:", arguments_);

        let result: unknown;

        try {
          result = await this.registry.execute(name, arguments_);
        } catch (error) {
          result = {
            error: error instanceof Error ? error.message : String(error),
          };
        }

        this.messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return "Превышен лимит вызовов инструментов.";
  }
}
