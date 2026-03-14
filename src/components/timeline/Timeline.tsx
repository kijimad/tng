import { useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Container, Flex, Text, Alert } from "@chakra-ui/react";
import { useFeeds, useCurrentUser } from "../../hooks/useFeeds";
import { FeedCard } from "../feed/FeedCard";
import { FeedCardSkeleton } from "../feed/FeedCardSkeleton";

const CONTENT_WIDTH = "lg";

// 高さのキャッシュをコンポーネント外で保持
const heightCache = new Map<number | string, number>();

export function Timeline(): React.ReactElement {
  const { feeds, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useFeeds();
  const { data: currentUser } = useCurrentUser();

  const parentRef = useRef<HTMLDivElement>(null);

  const itemCount = hasMore ? feeds.length + 1 : feeds.length;

  const getItemKey = useCallback(
    (index: number) => {
      const feed = feeds[index];
      return feed !== undefined ? feed.data.id : `loader-${index}`;
    },
    [feeds],
  );

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const key = getItemKey(index);
      return heightCache.get(key) ?? 300;
    },
    overscan: 10,
    getItemKey,
  });

  const items = virtualizer.getVirtualItems();

  // スクロール位置の監視
  const lastScrollTop = useRef(0);
  useEffect(() => {
    const el = parentRef.current;
    if (el === null) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const delta = scrollTop - lastScrollTop.current;
      const direction = delta > 0 ? "DOWN" : "UP";

      if (Math.abs(delta) > 50) {
        console.log(`[SCROLL JUMP] ${direction} delta=${delta.toFixed(0)} scrollTop=${scrollTop.toFixed(0)}`);
      }

      lastScrollTop.current = scrollTop;
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // 高さを測定してキャッシュに保存
  const measureElement = useCallback(
    (element: HTMLElement | null) => {
      if (element === null) return;

      const index = Number(element.dataset["index"]);
      if (Number.isNaN(index)) return;

      const key = getItemKey(index);
      const cachedHeight = heightCache.get(key);

      // 既にキャッシュがある場合は再測定しない
      if (cachedHeight !== undefined) {
        return;
      }

      const height = element.getBoundingClientRect().height;
      console.log(`[MEASURE] index=${index} key=${key} height=${height.toFixed(0)}`);
      heightCache.set(key, height);
      virtualizer.measureElement(element);
    },
    [getItemKey, virtualizer],
  );

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (lastItem === undefined) return;

    if (lastItem.index >= feeds.length - 10 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [items, feeds.length, hasMore, isLoadingMore, loadMore]);

  return (
    <Box ref={parentRef} height="100vh" overflow="auto">
      <Container maxW={CONTENT_WIDTH} py={3}>
        <Flex justify="flex-end" align="center">
          {currentUser?.name !== undefined && (
            <Text color="fg.muted" fontSize="sm">
              {currentUser.name}
            </Text>
          )}
        </Flex>
      </Container>

      {error !== null && (
        <Container maxW={CONTENT_WIDTH} py={4}>
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        </Container>
      )}

      {isLoading ? (
        <Container maxW={CONTENT_WIDTH} py={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            {[...Array(3)].map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))}
          </Box>
        </Container>
      ) : (
        <Box
          height={`${virtualizer.getTotalSize()}px`}
          width="100%"
          position="relative"
        >
          {items.map((virtualItem) => {
            const isLoaderRow = virtualItem.index >= feeds.length;
            const feed = feeds[virtualItem.index];

            return (
              <Box
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={measureElement}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                transform={`translateY(${virtualItem.start}px)`}
              >
                <Container maxW={CONTENT_WIDTH} pb={3}>
                  {isLoaderRow ? (
                    <FeedCardSkeleton />
                  ) : feed !== undefined ? (
                    <FeedCard feed={feed} />
                  ) : null}
                </Container>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
