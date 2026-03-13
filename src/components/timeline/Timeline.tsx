import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
} from "@chakra-ui/react";
import { useFeeds } from "../../hooks/useFeeds";
import { FeedCard } from "../feed/FeedCard";

export function Timeline(): React.ReactElement {
  const state = useFeeds();

  return (
    <Box bg="bg.subtle" minH="100vh">
      <Container maxW="container.md" py={4}>
        <Flex
          as="header"
          justify="space-between"
          align="center"
          py={3}
          borderBottomWidth="1px"
          borderColor="border"
          mb={4}
          position="sticky"
          top={0}
          bg="bg.subtle"
          zIndex={10}
        >
          <Heading size="lg">TUNAG Timeline</Heading>
          {state.status === "success" && (
            <Text color="fg.muted" fontSize="sm">
              {state.userName}
            </Text>
          )}
        </Flex>

        {state.status === "loading" && (
          <Flex justify="center" align="center" py={10} gap={3}>
            <Spinner size="md" color="brand.500" />
            <Text color="fg.muted">{state.message}</Text>
          </Flex>
        )}

        {state.status === "error" && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{state.message}</Alert.Title>
          </Alert.Root>
        )}

        {state.status === "success" && (
          <VStack gap={3} align="stretch">
            {state.feeds.length === 0 ? (
              <Text textAlign="center" py={10} color="fg.muted">
                表示するアイテムがありません
              </Text>
            ) : (
              state.feeds.map((feed) => (
                <FeedCard key={feed.data.id} feed={feed} />
              ))
            )}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
