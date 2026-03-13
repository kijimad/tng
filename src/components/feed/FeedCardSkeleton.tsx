import {
  Box,
  Card,
  Flex,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

export function FeedCardSkeleton(): React.ReactElement {
  return (
    <Card.Root bg="white" shadow="sm" borderRadius="xl">
      <Card.Body p={4}>
        <Flex gap={3} mb={3}>
          <SkeletonCircle size="44px" />
          <Box flex={1}>
            <Skeleton height="16px" width="120px" mb={2} />
            <Skeleton height="12px" width="80px" />
          </Box>
          <Skeleton height="12px" width="50px" />
        </Flex>

        <Skeleton height="20px" width="80px" mb={3} />

        <VStack gap={3} align="stretch">
          <Box>
            <Skeleton height="12px" width="100px" mb={2} />
            <Skeleton height="14px" width="100%" mb={1} />
            <Skeleton height="14px" width="80%" />
          </Box>
          <Box>
            <Skeleton height="12px" width="120px" mb={2} />
            <Skeleton height="14px" width="100%" mb={1} />
            <Skeleton height="14px" width="60%" />
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
