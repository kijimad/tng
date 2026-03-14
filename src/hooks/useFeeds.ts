import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TunagAPI } from "../api/client";
import type { Feed, FeedIndex } from "../types";

// API インスタンスをシングルトンで管理
let apiInstance: TunagAPI | null = null;
let apiInitPromise: Promise<TunagAPI> | null = null;

async function getApi(): Promise<TunagAPI> {
  if (apiInstance !== null) {
    return apiInstance;
  }
  if (apiInitPromise !== null) {
    return apiInitPromise;
  }
  apiInitPromise = (async () => {
    const api = new TunagAPI();
    await api.init();
    apiInstance = api;
    return api;
  })();
  return apiInitPromise;
}

interface PaginationInfo {
  position: number | null;
  groupingId: number | null;
}

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

function extractFeedsFromIndex(index: FeedIndex): Feed[] {
  const feeds: Feed[] = [];
  for (const item of index) {
    if (item.feeds !== undefined) {
      feeds.push(...item.feeds);
    }
  }
  return feeds;
}

export function useFeeds() {
  const query = useInfiniteQuery({
    queryKey: ["feeds"],
    queryFn: async ({ pageParam }) => {
      const api = await getApi();
      const index = await api.getGroupedFeeds(
        pageParam?.position ?? undefined,
        pageParam?.groupingId ?? undefined,
      );
      return {
        index,
        pagination: getPaginationFromIndex(index),
      };
    },
    initialPageParam: undefined as PaginationInfo | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.index.length === 0) {
        return undefined;
      }
      return lastPage.pagination.position !== null
        ? lastPage.pagination
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // 全ページからフィードを抽出し、重複を除去（APIの順序を維持）
  const feeds = useMemo(() => {
    if (!query.data) return [];

    const allFeeds: Feed[] = [];
    const seenIds = new Set<number>();

    for (const page of query.data.pages) {
      for (const feed of extractFeedsFromIndex(page.index)) {
        if (!seenIds.has(feed.data.id)) {
          seenIds.add(feed.data.id);
          allFeeds.push(feed);
        }
      }
    }

    return allFeeds;
  }, [query.data]);

  return {
    feeds,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error?.message ?? null,
    hasMore: query.hasNextPage ?? false,
    loadMore: () => {
      if (!query.isFetchingNextPage && query.hasNextPage) {
        void query.fetchNextPage();
      }
    },
  };
}
