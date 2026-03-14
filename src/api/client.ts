import type { CurrentUser, Feed, FeedIndex, Session } from "../types";

const API_BASE = "https://tunag.jp/api/v2" as const;

export class TunagAPIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "TunagAPIError";
  }
}

export class TunagAPI {
  private csrfToken: string | null = null;

  async init(): Promise<Session> {
    const session = await this.getSession();
    this.csrfToken = session.token;
    return session;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.csrfToken !== null) {
      (headers as Record<string, string>)["x-csrf-token"] = this.csrfToken;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new TunagAPIError(
          "ログインが必要です。tunag.jp にログインしてからお試しください。",
          response.status,
        );
      }
      throw new TunagAPIError(`API error: ${response.status}`, response.status);
    }

    return response.json() as Promise<T>;
  }

  private async getSession(): Promise<Session> {
    return this.request<Session>("/sessions");
  }

  async getCurrentUser(): Promise<CurrentUser> {
    return this.request<CurrentUser>("/current_user");
  }

  async getGroupedFeeds(
    position?: number,
    groupingId?: number,
  ): Promise<FeedIndex> {
    const params = new URLSearchParams();
    if (position !== undefined) {
      params.set("position", position.toString());
    }
    if (groupingId !== undefined) {
      params.set("grouping_id", groupingId.toString());
    }
    const query = params.toString();
    return this.request<FeedIndex>(
      `/feeds/grouped_index${query ? `?${query}` : ""}`,
    );
  }

  async getFeed(id: number): Promise<Feed> {
    return this.request<Feed>(`/feeds/${id.toString()}`);
  }

  async getFeeds(ids: readonly number[]): Promise<readonly Feed[]> {
    const results = await Promise.all(ids.map((id) => this.getFeed(id)));
    return results;
  }
}
