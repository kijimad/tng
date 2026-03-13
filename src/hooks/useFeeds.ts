import { useEffect, useState } from "react";
import { TunagAPI, TunagAPIError } from "../api/client";
import type { Feed, FeedIndex } from "../types";

export type FeedsState =
  | { readonly status: "loading"; readonly message: string }
  | { readonly status: "error"; readonly message: string }
  | {
      readonly status: "success";
      readonly feeds: readonly Feed[];
      readonly userName: string;
    };

function extractFeedIds(
  grouped: FeedIndex,
  maxPerGroup: number,
  maxTotal: number,
): readonly number[] {
  const feedIds: number[] = [];

  for (const group of grouped) {
    if (group.grouped) {
      const ids = group.feed_group.feed_ids.slice(0, maxPerGroup);
      feedIds.push(...ids);
    } else {
      feedIds.push(group.feed.id);
    }
  }

  const uniqueIds = [...new Set(feedIds)];
  return uniqueIds.slice(0, maxTotal);
}

function sortFeedsByDate(feeds: readonly Feed[]): readonly Feed[] {
  return [...feeds].sort((a, b) => {
    const dateA = new Date(a.data.created_at).getTime();
    const dateB = new Date(b.data.created_at).getTime();
    return dateB - dateA;
  });
}

export function useFeeds(): FeedsState {
  const [state, setState] = useState<FeedsState>({
    status: "loading",
    message: "初期化中...",
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const api = new TunagAPI();
        await api.init();

        const user = await api.getCurrentUser();

        setState({ status: "loading", message: "フィード一覧を取得中..." });

        const grouped = await api.getGroupedFeeds();
        const feedIds = extractFeedIds(grouped, 5, 30);

        setState({
          status: "loading",
          message: `${feedIds.length.toString()}件のフィードを取得中...`,
        });

        const feeds = await api.getFeeds(feedIds);
        const sortedFeeds = sortFeedsByDate(feeds);

        setState({
          status: "success",
          feeds: sortedFeeds,
          userName: user.name,
        });
      } catch (err: unknown) {
        const message =
          err instanceof TunagAPIError
            ? err.message
            : err instanceof Error
              ? err.message
              : "不明なエラーが発生しました";
        setState({ status: "error", message });
      }
    };

    void load();
  }, []);

  return state;
}
