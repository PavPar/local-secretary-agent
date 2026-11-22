import { OllamaProvider } from "./providers/ollama.provider.js";
import { LLMProvider } from "./types.js";
import { YandexProvider } from "./providers/yandex.provider.js";

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "ollama";

  switch (provider) {
    case "ollama": {
      const baseURL = process.env.OLLAMA_BASE_URL;
      const model = process.env.OLLAMA_MODEL;

      if (!baseURL || !model) {
        throw new Error("OLLAMA_BASE_URL and OLLAMA_MODEL are required");
      }

      return new OllamaProvider(baseURL, model);
    }
    case "yandex": {
      const apiKey = process.env.YANDEX_API_KEY;
      const folderId = process.env.YANDEX_FOLDER_ID;
      const modelUri = process.env.YANDEX_MODEL_URI;

      if (!apiKey || !folderId || !modelUri) {
        throw new Error(
          "YANDEX_API_KEY, YANDEX_FOLDER_ID and YANDEX_MODEL_URI are required",
        );
      }

      return new YandexProvider(apiKey, folderId, modelUri);
    }

    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}
