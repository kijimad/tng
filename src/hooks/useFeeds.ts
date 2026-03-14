import { useCallback, useEffect, useRef, useState } from "react";
import { TunagAPI, TunagAPIError } from "../api/client";
import type { Feed, FeedIndex } from "../types";

export type FeedsState = {
  readonly feeds: readonly Feed[];
  readonly userName: string;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
};

function extractFromIndex(index: FeedIndex, seenIds: Set<number>): Feed[] {
  const feeds: Feed[] = [];

  for (const item of index) {
    // インラインフィードのみを使用（個別フェッチは遅いため行わない）
    if (item.feeds !== undefined) {
      for (const feed of item.feeds) {
        if (!seenIds.has(feed.data.id)) {
          feeds.push(feed);
          seenIds.add(feed.data.id);
        }
      }
    }
  }

  return feeds;
}

interface PaginationInfo {
  position: number | null;
  groupingId: number | null;
}

// インデックスからページネーション情報を取得
function getPaginationFromIndex(index: FeedIndex): PaginationInfo {
  for (let i = index.length - 1; i >= 0; i--) {
    const item = index[i];
    if (item === undefined) continue;

    if (item.grouped) {
      const feedIds = item.feed_group.feed_ids;
      const lastId = feedIds[feedIds.length - 1];
      if (lastId !== undefined) {
        return {
          position: lastId,
          groupingId: item.feed_group.first_grouping_id,
        };
      }
    }
    if (item.feeds !== undefined && item.feeds.length > 0) {
      const lastFeed = item.feeds[item.feeds.length - 1];
      if (lastFeed !== undefined) {
        return {
          position: lastFeed.data.id,
          groupingId: null,
        };
      }
    }
  }
  return { position: null, groupingId: null };
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
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const paginationRef = useRef<PaginationInfo>({ position: null, groupingId: null });

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const api = new TunagAPI();
        await api.init();
        apiRef.current = api;

        const user = await api.getCurrentUser();
        const index = await api.getGroupedFeeds();
        const inlineFeeds = extractFromIndex(index, seenIdsRef.current);

        paginationRef.current = getPaginationFromIndex(index);
        hasMoreRef.current = index.length > 0;

        setState({
          feeds: sortFeedsByDate(inlineFeeds),
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
      apiRef.current === null ||
      paginationRef.current.position === null
    ) {
      return;
    }

    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const load = async (): Promise<void> => {
      try {
        const api = apiRef.current;
        if (api === null) return;

        const { position, groupingId } = paginationRef.current;
        const nextIndex = await api.getGroupedFeeds(
          position ?? undefined,
          groupingId ?? undefined,
        );

        if (nextIndex.length === 0) {
          hasMoreRef.current = false;
          isLoadingMoreRef.current = false;
          setState((prev) => ({
            ...prev,
            isLoadingMore: false,
            hasMore: false,
          }));
          return;
        }

        const newFeeds = extractFromIndex(nextIndex, seenIdsRef.current);
        paginationRef.current = getPaginationFromIndex(nextIndex);
        isLoadingMoreRef.current = false;

        setState((prev) => ({
          ...prev,
          feeds: sortFeedsByDate([...prev.feeds, ...newFeeds]),
          isLoadingMore: false,
          hasMore: true,
        }));
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
