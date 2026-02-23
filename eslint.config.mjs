import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import stylistic from "@stylistic/eslint-plugin"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/semi": ["error", "never"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/brace-style": ["error", "1tbs"],
      "curly": ["error", "all"],
    },
  },
])

export default eslintConfig
