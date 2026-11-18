import type { ChatCompletionTool } from "openai/resources/chat/completions";

import type { ScrumboyClient } from "../scrumboy/client.js";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "projects_list",
      description: "Получить список проектов пользователя в Scrumboy",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "me_get",
      description: "Получить информацию о текущем пользователе Scrumboy",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "todos_create",
      description:
        "Создать новую задачу в указанном проекте Scrumboy. Используй только когда пользователь явно просит создать задачу.",
      parameters: {
        type: "object",
        properties: {
          projectSlug: {
            type: "string",
            description: "Slug проекта Scrumboy",
          },
          title: {
            type: "string",
            description: "Название новой задачи",
          },
          body: {
            type: "string",
            description: "описание новой задачи",
          },
        },
        required: ["projectSlug", "title"],
        additionalProperties: false,
      },
    },
  },
];

export class ToolRegistry {
  constructor(private readonly scrumboy: ScrumboyClient) {}

  async execute(
    name: string,
    arguments_: Record<string, unknown>,
  ): Promise<unknown> {
    switch (name) {
      case "projects_list":
        return this.scrumboy.callTool("projects_list", arguments_);

      case "me_get":
        return this.scrumboy.callTool("me_get", arguments_);

      case "todos_create":
        return this.scrumboy.callTool("todos_create", arguments_);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
