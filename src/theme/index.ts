import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "#ffffff" },
          subtle: { value: "#f9fafb" },
          muted: { value: "#f3f4f6" },
        },
        fg: {
          DEFAULT: { value: "#111827" },
          muted: { value: "#6b7280" },
          subtle: { value: "#9ca3af" },
        },
        border: {
          DEFAULT: { value: "#e5e7eb" },
          muted: { value: "#f3f4f6" },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "white",
      color: "fg",
    },
    ".markdown-content": {
      "& p": {
        marginBottom: "0.5em",
        _last: { marginBottom: 0 },
      },
      "& ul, & ol": {
        paddingLeft: "1.5em",
        marginBottom: "0.5em",
      },
      "& li": {
        listStyle: "inherit",
      },
      "& a": {
        color: "#0000ee",
        textDecoration: "underline",
      },
      "& code": {
        bg: "gray.100",
        px: "0.25em",
        borderRadius: "sm",
        fontSize: "0.9em",
      },
      "& pre": {
        bg: "gray.100",
        p: "0.5em",
        borderRadius: "md",
        overflowX: "auto",
        marginBottom: "0.5em",
      },
      "& blockquote": {
        borderLeftWidth: "3px",
        borderLeftColor: "gray.300",
        paddingLeft: "1em",
        color: "gray.600",
        marginBottom: "0.5em",
      },
      "& h1, & h2, & h3, & h4, & h5, & h6": {
        fontWeight: "bold",
        marginBottom: "0.5em",
      },
    },
  },
});
