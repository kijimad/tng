import {
  Box,
  Card,
  Flex,
  Image,
  Text,
  Badge,
  VStack,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Feed } from "../../types";

interface FeedCardProps {
  readonly feed: Feed;
}

export function FeedCard({ feed }: FeedCardProps): React.ReactElement {
  const { data } = feed;

  return (
    <Card.Root bgColor="gray.50">
      <Card.Body p={4}>
        <Flex gap={3} mb={3}>
          <Image
            src={data.user.icon_path}
            alt={data.user.name}
            boxSize="44px"
            borderRadius="full"
            objectFit="cover"
            flexShrink={0}
          />
          <Box flex={1} minW={0}>
            <Text fontWeight="semibold" fontSize="md">
              {data.user.name}
            </Text>
            {data.user.department !== null && (
              <Text fontSize="xs" color="gray.500" truncate>
                {data.user.department}
              </Text>
            )}
          </Box>
          <Text fontSize="xs" color="gray.400" flexShrink={0}>
            {data.created_at_label}
          </Text>
        </Flex>

        {data.menu !== null && (
          <Badge colorPalette="purple" mb={3}>
            {data.menu.title}
          </Badge>
        )}

        {data.apply !== null && data.apply.substances.length > 0 && (
          <VStack gap={3} align="stretch">
            {data.apply.substances.map((sub) => {
              if (sub.value === null || sub.value.trim() === "") {
                return null;
              }
              return (
                <Box
                  key={sub.id}
                  pb={3}
                  borderBottomWidth="1px"
                  borderColor="gray.100"
                  _last={{ borderBottom: "none", pb: 0 }}
                >
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.500"
                    mb={1}
                  >
                    {sub.key}
                  </Text>
                  <Box
                    fontSize="sm"
                    color="gray.700"
                    className="markdown-content"
                  >
                    <Markdown remarkPlugins={[remarkGfm]}>{sub.value}</Markdown>
                  </Box>
                </Box>
              );
            })}
          </VStack>
        )}

        {data.message !== null && (
          <Box fontSize="sm" color="gray.700" className="markdown-content">
            <Markdown remarkPlugins={[remarkGfm]}>{data.message}</Markdown>
          </Box>
        )}

        {data.apply !== null && data.apply.images.length > 0 && (
          <SimpleGrid columns={{ base: 2, md: 3 }} gap={2} mt={3}>
            {data.apply.images.map((img, idx) => (
              <Image
                key={idx}
                src={img.thumbnail !== "" ? img.thumbnail : img.image}
                alt=""
                borderRadius="md"
                objectFit="cover"
                maxH="150px"
                cursor="pointer"
                _hover={{ opacity: 0.9 }}
                onClick={() => {
                  const url =
                    img.original_image !== "" ? img.original_image : img.image;
                  window.open(url, "_blank");
                }}
              />
            ))}
          </SimpleGrid>
        )}

        <Flex justify="flex-end" mt={2}>
          <Link
            href={`https://tunag.jp/feeds/${data.id}`}
            target="_blank"
            color="gray.400"
            _hover={{ color: "gray.600" }}
            title="元の投稿を開く"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
