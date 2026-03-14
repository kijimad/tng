import {
  Box,
  Card,
  Flex,
  Image,
  Text,
  Badge,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
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
                    <Markdown>{sub.value}</Markdown>
                  </Box>
                </Box>
              );
            })}
          </VStack>
        )}

        {data.message !== null && (
          <Box fontSize="sm" color="gray.700" className="markdown-content">
            <Markdown>{data.message}</Markdown>
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

      </Card.Body>
    </Card.Root>
  );
}
