# @diphyx/eslint-plugin

Opinionated ESLint rules and a ready-to-use flat config for DiPhyx's Nuxt/Vue + [Harlemify](https://github.com/diphyx/harlemify) code. Add one dependency and every DiPhyx app lints the same way.

`eslint-plugin-vue` checks general Vue style. This plugin adds the DiPhyx-specific patterns it can't know about: where template directives go, how `<script setup>` is ordered and written, the shape of a Harlemify `createStore`, how composables are named, and when to use [radash](https://radash-docs.vercel.app) / [VueUse](https://vueuse.org) instead of writing the code by hand.

## Highlights

- **35 custom rules** for SFC templates, `<script setup>` structure, Harlemify stores, composable naming, code layout, and radash / VueUse usage.
- **One-line preset** — `configs.recommended` sets up the TypeScript + Vue parsers, the needed `eslint-plugin-vue` rules, file naming, and every custom rule.
- **No extra dependencies** — the parsers and plugins come inside this package; you only install `eslint` itself.
- **Guidance, not gates** — every rule is a warning and none auto-fix, so it guides you without blocking commits.
- **Modern setup** — flat config, ESLint 9+, ESM only.

## Install

```bash
pnpm add -D @diphyx/eslint-plugin eslint
```

This package includes its own parser and plugin dependencies (`@typescript-eslint/*`, `vue-eslint-parser`, `eslint-plugin-vue`, `eslint-plugin-check-file`), so `eslint` is the only thing you install yourself.

## Usage

`eslint.config.mjs`:

```js
import diphyx from "@diphyx/eslint-plugin";

export default [
    ...diphyx.configs.recommended,

    // project-specific overrides / ignores
    {
        ignores: ["node_modules/**", ".nuxt/**", ".output/**", "dist/**", "**/*.d.ts"],
    },
];
```

### Enabling rules individually

If you don't want the preset, add the plugin and turn on rules yourself:

```js
import diphyx from "@diphyx/eslint-plugin";

export default [
    {
        files: ["**/*.vue"],
        plugins: { "@diphyx": diphyx },
        rules: {
            "@diphyx/template-v-if": "warn",
            "@diphyx/template-text": "warn",
        },
    },
];
```

## Rules

All rules only report warnings; none auto-fix. Each rule has its own page
under [`docs/rules/`](./docs/rules) (also linked from the rule's `meta.docs.url`).

### Template (`*.vue`)

| Rule                    | Enforces                                                              |
| ----------------------- | --------------------------------------------------------------------- |
| `template-v-if`         | `v-if` must be on a `<template>` wrapper                              |
| `template-v-else`       | `v-else` / `v-else-if` must be on a `<template>` wrapper              |
| `template-v-for`        | `v-for` must be on a `<template>` wrapper                             |
| `template-text`         | bare text must be wrapped in an HTML tag                              |
| `template-props-prefix` | props must be read via `props.` in the template, not the bare binding |

### Script (`*.vue`)

| Rule                   | Enforces                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `script-section-order` | script-setup section order: import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose |
| `script-define-object` | `define*` macros must declare their shape with a runtime object, not the type-only form                                         |
| `script-define-const`  | `define*` macros must be assigned to a const with the conventional name (`props` / `model` / `emit` / `slots`)                  |

### Store — Harlemify `createStore`

| Rule                                                                  | Enforces                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `store-require-name`                                                  | config has a required `name` property                      |
| `store-require-model` / `store-require-view` / `store-require-action` | required sections are present                              |
| `store-section-function`                                              | sections are functions                                     |
| `store-section-method`                                                | sections use method shorthand (not arrow functions)        |
| `store-section-return-shorthand`                                      | sections return a shorthand object of named consts         |
| `store-config-order`                                                  | key order: name → model → view → action → compose → lazy   |
| `store-no-unknown-key`                                                | no unknown config keys                                     |
| `store-suffix`                                                        | store variable ends in `Store`                             |
| `store-name-match`                                                    | `name` matches the variable (`accountStore` → `"account"`) |
| `store-shape-suffix`                                                  | `shape()` result is named `*Shape`                         |
| `store-mode-enum`                                                     | `mode` uses a `ModelMode` enum, not a string literal       |

### Composable (`app/composables/*.ts`)

| Rule                | Enforces                             |
| ------------------- | ------------------------------------ |
| `composable-naming` | exported composables follow `useXxx` |

### Radash preferences (`*.ts`, `*.vue`)

Prefer [radash](https://radash-docs.vercel.app) helpers instead of writing the same thing by hand.

| Rule                   | Enforces                                                                        |
| ---------------------- | ------------------------------------------------------------------------------- |
| `radash-prefer-is`     | prefer radash `is*` helpers over `typeof` comparisons                           |
| `radash-prefer-call`   | prefer radash helpers over native global calls (`Promise.all`, `Array.isArray`) |
| `radash-prefer-clone`  | prefer `clone()` over `JSON.parse(JSON.stringify())`                            |
| `radash-prefer-unique` | prefer `unique()` over spreading a `new Set()`                                  |
| `radash-prefer-sum`    | prefer `sum()` over a `reduce` that adds values                                 |
| `radash-prefer-sleep`  | prefer `sleep()` over wrapping `setTimeout` in a Promise                        |

### VueUse preferences (`*.ts`, `*.vue`)

Prefer [VueUse](https://vueuse.org) composables (which clean up automatically) over raw browser APIs.

These rules only report inside a Vue effect scope — a `.vue` `<script setup>`, a component `setup()`, or a `use*` composable — because that is where VueUse's `onScopeDispose` cleanup runs. Plain TypeScript modules, utility functions, and non-component classes are left alone. Code inside a detached callback (an event handler like `el.onopen = …`, a `setTimeout`/`setInterval`/`addEventListener` callback, or a `.then`/`.catch`/`.finally` continuation) runs after the scope has closed, so it is left alone too.

| Rule                        | Enforces                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `vueuse-prefer-storage`     | prefer `useLocalStorage` / `useSessionStorage` over raw Web Storage                                  |
| `vueuse-prefer-member-call` | prefer VueUse composables over raw DOM/window method calls (`addEventListener`, `matchMedia`)        |
| `vueuse-prefer-timer`       | prefer VueUse timer composables over native timers (`setInterval`)                                   |
| `vueuse-prefer-observer`    | prefer VueUse observer composables over raw observers                                                |
| `vueuse-prefer-clipboard`   | prefer `useClipboard()` over `navigator.clipboard`                                                   |
| `vueuse-prefer-route`       | prefer `useRouteQuery` / `useRouteParams` / `useRouteHash` over `useRoute().query`/`.params`/`.hash` |

### Layout (`*.ts`, `*.vue`)

Keep multi-line statements apart in script/TypeScript code.

| Rule                      | Enforces                                                   |
| ------------------------- | ---------------------------------------------------------- |
| `multiline-block-padding` | require a blank line between multi-line sibling statements |

## License

MIT
