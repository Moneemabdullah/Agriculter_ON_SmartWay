const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
    {
        ignores: ["dist", "node_modules", "**/*.js"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unsafe-function-type": "warn",
            "@typescript-eslint/no-namespace": "warn",
        },
    },
];
