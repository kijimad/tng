import { useState } from "react";
import { Box, Image, Skeleton } from "@chakra-ui/react";
import type { FeedImage as FeedImageType } from "../../types";

interface FeedImageProps {
  readonly image: FeedImageType;
}

// サムネイルは固定サイズ
const THUMB_SIZE = 120;

export function FeedImage({ image }: FeedImageProps): React.ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);

  const src = image.thumbnail !== "" ? image.thumbnail : image.image;

  return (
    <Box
      position="relative"
      width={`${THUMB_SIZE}px`}
      height={`${THUMB_SIZE}px`}
      borderRadius="md"
      overflow="hidden"
      flexShrink={0}
    >
      {!isLoaded && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
        />
      )}
      <Image
        src={src}
        alt=""
        width="100%"
        height="100%"
        objectFit="cover"
        cursor="pointer"
        _hover={{ opacity: 0.9 }}
        onLoad={() => setIsLoaded(true)}
        onClick={() => {
          const url =
            image.original_image !== "" ? image.original_image : image.image;
          window.open(url, "_blank");
        }}
      />
    </Box>
  );
}
