import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                // Browser globals
                window: "readonly",
                document: "readonly",
                console: "readonly",
                FileReader: "readonly",
                DataTransfer: "readonly",
                // Node globals (for webpack config)
                module: "readonly",
                require: "readonly",
                __dirname: "readonly",
                process: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 4],
            "no-multiple-empty-lines": ["error", { max: 1 }],
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],
            "no-var": "error",
            "prefer-const": "warn",
        },
    },
    {
        ignores: ["docs/", "node_modules/"],
    },
];
