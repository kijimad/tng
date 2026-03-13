import { ChakraProvider } from "@chakra-ui/react";
import {
  render as originalRender,
  renderHook as originalRenderHook,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { system } from "../theme";
import type { RenderHookOptions, RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

export const render = (
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> = {},
) => {
  const user = userEvent.setup();

  const renderResult = originalRender(ui, {
    ...options,
    wrapper: (props) => <ChakraProvider value={system} {...props} />,
  });

  return { ...renderResult, user };
};

export const renderHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options: Omit<RenderHookOptions<Props>, "wrapper"> = {},
) => {
  return originalRenderHook(hook, {
    ...options,
    wrapper: (props) => <ChakraProvider value={system} {...props} />,
  });
};
