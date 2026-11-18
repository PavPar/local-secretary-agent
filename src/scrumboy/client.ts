
type ScrumboyResponse = Record<string, unknown>;

export class ScrumboyClient {
  private readonly endpoint: string;
  private readonly token: string;

  constructor() {
    const baseUrl =
      process.env.SCRUMBOY_URL ?? "http://localhost:8080";

    const token = process.env.SCRUMBOY_TOKEN;

    if (!token) {
      throw new Error("SCRUMBOY_TOKEN is missing");
    }

    this.endpoint = `${baseUrl.replace(/\/+$/, "")}/mcp`;
    this.token = token;
  }

  private async request<T>(
    method: "GET" | "POST",
    body?: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(this.endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `Scrumboy API error ${response.status}: ${errorBody}`,
      );
    }

    return (await response.json()) as T;
  }

  async getCapabilities(): Promise<ScrumboyResponse> {
    return this.request<ScrumboyResponse>("GET");
  }

  async callTool(
    name: string,
    input: Record<string, unknown> = {},
  ): Promise<ScrumboyResponse> {
    return this.request<ScrumboyResponse>("POST", {
      tool: name,
      input,
    });
  }
}
