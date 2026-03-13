import { useCallback, useEffect, useRef, useState } from "react";
import { TunagAPI, TunagAPIError } from "../api/client";
import type { Feed, FeedIndex } from "../types";

const FEEDS_PER_PAGE = 5;

export type FeedsState = {
  readonly feeds: readonly Feed[];
  readonly userName: string;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
};

function extractAllFeedIds(grouped: FeedIndex): number[] {
  const feedIds: number[] = [];

  for (const group of grouped) {
    if (group.grouped) {
      feedIds.push(...group.feed_group.feed_ids);
    } else {
      feedIds.push(group.feed.id);
    }
  }

  return [...new Set(feedIds)];
}

function sortFeedsByDate(feeds: readonly Feed[]): readonly Feed[] {
  return [...feeds].sort((a, b) => {
    const dateA = new Date(a.data.created_at).getTime();
    const dateB = new Date(b.data.created_at).getTime();
    return dateB - dateA;
  });
}

export function useFeeds(): FeedsState & { loadMore: () => void } {
  const [state, setState] = useState<FeedsState>({
    feeds: [],
    userName: "",
    isLoading: true,
    isLoadingMore: false,
    error: null,
    hasMore: true,
  });

  const apiRef = useRef<TunagAPI | null>(null);
  const allFeedIdsRef = useRef<number[]>([]);
  const loadedCountRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const api = new TunagAPI();
        await api.init();
        apiRef.current = api;

        const user = await api.getCurrentUser();
        const grouped = await api.getGroupedFeeds();
        const feedIds = extractAllFeedIds(grouped);
        allFeedIdsRef.current = feedIds;

        const initialIds = feedIds.slice(0, FEEDS_PER_PAGE);
        const feeds = await api.getFeeds(initialIds);
        loadedCountRef.current = initialIds.length;
        hasMoreRef.current = feedIds.length > FEEDS_PER_PAGE;

        setState({
          feeds: sortFeedsByDate(feeds),
          userName: user.name,
          isLoading: false,
          isLoadingMore: false,
          error: null,
          hasMore: hasMoreRef.current,
        });
      } catch (err: unknown) {
        const message =
          err instanceof TunagAPIError
            ? err.message
            : err instanceof Error
              ? err.message
              : "不明なエラーが発生しました";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
      }
    };

    void init();
  }, []);

  const loadMore = useCallback(() => {
    if (
      isLoadingMoreRef.current ||
      !hasMoreRef.current ||
      apiRef.current === null
    ) {
      return;
    }

    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const load = async (): Promise<void> => {
      try {
        const api = apiRef.current;
        if (api === null) return;

        const start = loadedCountRef.current;
        const nextIds = allFeedIdsRef.current.slice(
          start,
          start + FEEDS_PER_PAGE,
        );

        if (nextIds.length === 0) {
          hasMoreRef.current = false;
          isLoadingMoreRef.current = false;
          setState((prev) => ({
            ...prev,
            isLoadingMore: false,
            hasMore: false,
          }));
          return;
        }

        const newFeeds = await api.getFeeds(nextIds);
        loadedCountRef.current += nextIds.length;
        hasMoreRef.current =
          loadedCountRef.current < allFeedIdsRef.current.length;
        isLoadingMoreRef.current = false;

        setState((prev) => {
          const existingIds = new Set(prev.feeds.map((f) => f.data.id));
          const uniqueNewFeeds = newFeeds.filter(
            (f) => !existingIds.has(f.data.id),
          );
          return {
            ...prev,
            feeds: [...prev.feeds, ...sortFeedsByDate(uniqueNewFeeds)],
            isLoadingMore: false,
            hasMore: hasMoreRef.current,
          };
        });
      } catch (err: unknown) {
        const message =
          err instanceof TunagAPIError
            ? err.message
            : err instanceof Error
              ? err.message
              : "追加読み込みに失敗しました";
        isLoadingMoreRef.current = false;
        setState((prev) => ({
          ...prev,
          isLoadingMore: false,
          error: message,
        }));
      }
    };

    void load();
  }, []);

  return { ...state, loadMore };
}
