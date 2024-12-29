import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ["dist", "public"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["./src/**/*.{ts,tsx}"],

    languageOptions: {
      globals: {
        AudioWorkletGlobalScope: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,

      "simple-import-sort": simpleImportSort,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      "@typescript-eslint/no-explicit-any": "off",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  }
);
