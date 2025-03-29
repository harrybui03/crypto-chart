import eslint from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

export default [
    eslint.configs.recommended,

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
            "prefer-const": "error",
            "no-console": "warn",
            ...typescriptPlugin.configs.recommended.rules,
        },
    },

    {
        ignores: ["dist/**", "node_modules/**"],
    },
];