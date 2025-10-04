import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#f0f4ff" },
          100: { value: "#e0e9ff" },
          200: { value: "#c7d6fe" },
          300: { value: "#a4b9fc" },
          400: { value: "#8197f8" },
          500: { value: "#6471f1" },
          600: { value: "#4e52e5" },
          700: { value: "#4240ca" },
          800: { value: "#3735a3" },
          900: { value: "#323381" },
        },
        secondary: {
          50: { value: "#f5f7fa" },
          100: { value: "#eaeef4" },
          200: { value: "#d0dae7" },
          300: { value: "#a8bbd3" },
          400: { value: "#7997ba" },
          500: { value: "#577ba3" },
          600: { value: "#446289" },
          700: { value: "#384f70" },
          800: { value: "#30435d" },
          900: { value: "#2b3a4e" },
        },
        success: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
        },
        warning: {
          50: { value: "#fffbeb" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
        },
        error: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
          700: { value: "#b91c1c" },
          800: { value: "#991b1b" },
          900: { value: "#7f1d1d" },
        },
      },
      fonts: {
        heading: { value: `'Poppins', system-ui, sans-serif` },
        body: { value: `'Inter', system-ui, sans-serif` },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
