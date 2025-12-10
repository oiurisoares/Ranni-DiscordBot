import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{ts,tsx,js,mjs,cjs}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
            globals: globals.node,
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
            "arrow-body-style": [
                "error", "always"
            ],
            "comma-spacing": [
                "error", {
                    before: false,
                    after: true
                }],
            "comma-style": [
                "error", "last"],

            "default-case": [
                "error",
                { commentPattern: "^skip\\sdefault" }
            ],
            "function-call-argument-newline": [
                "error", "consistent"
            ],
            "function-paren-newline": [
                "error", "multiline"
            ],
            "import/extensions": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: true,
                },
            ],
            indent: [
                "error", 4
            ],
            "key-spacing": [
                "error",
                {
                    beforeColon: false,
                    afterColon: true
                }
            ],
            "linebreak-style": [
                "error", "windows"
            ],
            "max-len": [
                "error", { code: 90 }
            ],
            quotes: [
                "error", "single"
            ],
            semi: [
                "error", "always"
            ],
            "no-console": "off",
            "no-unused-vars": "off",
            "no-undef": "off",
            "no-use-before-define": "off",
            strict: "off",
            camelcase: "off"
        },
    },
]);
