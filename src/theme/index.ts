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
      bg: "bg.subtle",
      color: "fg",
    },
  },
});
