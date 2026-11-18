import OpenAI from "openai";
import type {
  ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";

export class OllamaClient {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const baseURL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";

    const model = process.env.OLLAMA_MODEL ?? "qwen3.5:9b";

    this.client = new OpenAI({
      baseURL,
      apiKey: "ollama",
      timeout: 120_000,
      maxRetries: 0,
    });

    this.model = model;
  }

  async chat(
    messages: ChatCompletionMessageParam[],
    tools?: ChatCompletionTool[],
  ): Promise<ChatCompletion> {
    return this.client.chat.completions.create({
      model: this.model,
      messages,
      tools,
      tool_choice: tools ? "auto" : "none",
      temperature: 0.2,
      max_tokens: 1024,
      reasoning_effort: "low",
    });
  }
}
