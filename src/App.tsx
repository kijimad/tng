import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { Timeline } from "./components/timeline/Timeline";

export function App(): React.ReactElement {
  return (
    <ChakraProvider value={system}>
      <Timeline />
    </ChakraProvider>
  );
}
