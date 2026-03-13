import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Container, Flex, Text, Alert } from "@chakra-ui/react";
import { useFeeds } from "../../hooks/useFeeds";
import { FeedCard } from "../feed/FeedCard";
import { FeedCardSkeleton } from "../feed/FeedCardSkeleton";

export function Timeline(): React.ReactElement {
  const {
    feeds,
    userName,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useFeeds();

  const parentRef = useRef<HTMLDivElement>(null);

  const itemCount = hasMore ? feeds.length + 1 : feeds.length;

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 3,
    measureElement: (element) => element.getBoundingClientRect().height,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (lastItem === undefined) return;

    if (lastItem.index >= feeds.length - 1 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [items, feeds.length, hasMore, isLoadingMore, loadMore]);

  return (
    <Box bg="bg.subtle" minH="100vh">
      <Container maxW="container.md" py={4}>
        <Flex
          justify="space-between"
          py={3}
          mb={4}
          top={0}
          bg="bg.subtle"
          zIndex={10}
        >
          {userName !== "" && (
            <Text color="fg.muted" fontSize="sm">
              {userName}
            </Text>
          )}
        </Flex>

        {error !== null && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {isLoading ? (
          <Box display="flex" flexDirection="column" gap={3}>
            {[...Array(3)].map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))}
          </Box>
        ) : (
          <Box ref={parentRef} height="calc(100vh - 120px)" overflow="auto">
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
                    ref={virtualizer.measureElement}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    transform={`translateY(${virtualItem.start}px)`}
                    pb={3}
                  >
                    {isLoaderRow ? (
                      <FeedCardSkeleton />
                    ) : feed !== undefined ? (
                      <FeedCard feed={feed} />
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
