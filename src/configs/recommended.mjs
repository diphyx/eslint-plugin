import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

import tsPlugin from "@typescript-eslint/eslint-plugin";
import vuePlugin from "eslint-plugin-vue";
import checkFilePlugin from "eslint-plugin-check-file";

const namingConvention = [
    "warn",
    {
        selector: "enum",
        format: ["PascalCase"],
    },
    {
        selector: "enumMember",
        format: ["UPPER_CASE"],
    },
    {
        selector: "typeAlias",
        format: ["PascalCase"],
    },
    {
        selector: "interface",
        format: ["PascalCase"],
    },
];

export function createRecommended(plugin) {
    return [
        {
            files: ["**/*.ts"],
            languageOptions: {
                parser: tsParser,
                parserOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module",
                },
            },
            plugins: {
                "@typescript-eslint": tsPlugin,
            },
            rules: {
                "no-unused-vars": "off",
                "no-undef": "off",
                "@typescript-eslint/naming-convention": namingConvention,
                "arrow-body-style": ["warn", "always"],
            },
        },

        {
            files: ["**/*.vue"],
            languageOptions: {
                parser: vueParser,
                parserOptions: {
                    parser: tsParser,
                    ecmaVersion: "latest",
                    sourceType: "module",
                    extraFileExtensions: [".vue"],
                },
            },
            plugins: {
                vue: vuePlugin,
                "@typescript-eslint": tsPlugin,
                "@diphyx": plugin,
            },
            rules: {
                "no-unused-vars": "off",
                "no-undef": "off",
                "@typescript-eslint/naming-convention": namingConvention,
                "arrow-body-style": ["warn", "always"],

                "vue/block-lang": ["warn", { script: { lang: "ts" } }],
                "vue/component-api-style": ["warn", ["script-setup"]],
                "vue/define-macros-order": "off",
                "vue/attributes-order": [
                    "warn",
                    {
                        order: [
                            "DEFINITION",
                            "LIST_RENDERING",
                            "CONDITIONALS",
                            "RENDER_MODIFIERS",
                            "GLOBAL",
                            "UNIQUE",
                            "SLOT",
                            "TWO_WAY_BINDING",
                            "OTHER_DIRECTIVES",
                            "ATTR_STATIC",
                            "ATTR_DYNAMIC",
                            "EVENTS",
                            "CONTENT",
                            "ATTR_SHORTHAND_BOOL",
                        ],
                        alphabetical: false,
                    },
                ],

                "@diphyx/template-v-if": "warn",
                "@diphyx/template-v-else": "warn",
                "@diphyx/template-v-for": "warn",
                "@diphyx/template-text": "warn",
                "@diphyx/template-props-prefix": "warn",
                "@diphyx/script-section-order": "warn",
                "@diphyx/script-define-object": "warn",
                "@diphyx/script-define-const": "warn",
            },
        },

        {
            files: ["app/components/**/*.vue"],
            ignores: ["**/index.vue"],
            plugins: {
                "check-file": checkFilePlugin,
            },
            rules: {
                "check-file/filename-naming-convention": ["warn", { "**/*.vue": "PASCAL_CASE" }],
            },
        },

        {
            files: ["app/stores/*.ts", "app/composables/*.ts"],
            plugins: {
                "@diphyx": plugin,
            },
            rules: {
                "@diphyx/store-require-name": "warn",
                "@diphyx/store-require-model": "warn",
                "@diphyx/store-require-view": "warn",
                "@diphyx/store-require-action": "warn",
                "@diphyx/store-section-function": "warn",
                "@diphyx/store-section-method": "warn",
                "@diphyx/store-section-return-shorthand": "warn",
                "@diphyx/store-config-order": "warn",
                "@diphyx/store-no-unknown-key": "warn",
                "@diphyx/store-suffix": "warn",
                "@diphyx/store-name-match": "warn",
                "@diphyx/store-shape-suffix": "warn",
                "@diphyx/store-mode-enum": "warn",
            },
        },

        {
            files: ["app/composables/*.ts"],
            plugins: {
                "@diphyx": plugin,
            },
            rules: {
                "@diphyx/composable-naming": "warn",
            },
        },

        {
            files: ["**/*.ts", "**/*.vue"],
            plugins: {
                "@diphyx": plugin,
            },
            rules: {
                "@diphyx/radash-prefer-is": "warn",
                "@diphyx/radash-prefer-call": "warn",
                "@diphyx/radash-prefer-clone": "warn",
                "@diphyx/radash-prefer-unique": "warn",
                "@diphyx/radash-prefer-sum": "warn",
                "@diphyx/radash-prefer-sleep": "warn",
                "@diphyx/vueuse-prefer-storage": "warn",
                "@diphyx/vueuse-prefer-member-call": "warn",
                "@diphyx/vueuse-prefer-timer": "warn",
                "@diphyx/vueuse-prefer-observer": "warn",
                "@diphyx/vueuse-prefer-clipboard": "warn",
                "@diphyx/vueuse-prefer-route": "warn",
            },
        },

        {
            files: ["**/*.ts", "**/*.vue"],
            plugins: {
                "@diphyx": plugin,
            },
            rules: {
                "@diphyx/multiline-block-padding": "warn",
            },
        },
    ];
}
