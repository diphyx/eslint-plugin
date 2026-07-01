# AGENT.md — DiPhyx Code Conventions (`@diphyx/eslint-plugin`)

This project lints with **`@diphyx/eslint-plugin`** — 36 opinionated rules for Nuxt/Vue +
[Harlemify](https://github.com/diphyx/harlemify) code, all under the `@diphyx/` namespace.
This file is the agent's guide to those rules: **write code to match these conventions from
the start**, and when you see a `@diphyx/<id>` warning, look up `<id>` here for the fix.

**How to use this file**

1. A warning reads `@diphyx/<rule-id>` (e.g. `@diphyx/store-name-match`). Ctrl-F that
   `<rule-id>` — it appears in the lookup table (§0) and its detail section.
2. **None of these rules auto-fix.** `eslint --fix` will NOT touch them — edit by hand
   using the before→after shown here.
3. Only change code inside the **file scope** a rule targets (the "Files" column). Don't
   apply a `.vue`-only convention to a plain `.ts` file, etc.
4. After editing, re-run the linter to confirm the warning is gone and you didn't trip a
   neighbouring rule (e.g. reordering can affect `multiline-block-padding`).

---

## 0. Fast lookup — every rule, trigger → fix

| Rule id (`@diphyx/…`)            | Files                  | Fires when…                                                | Fix                                             |
| -------------------------------- | ---------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `template-v-if`                  | `*.vue`                | `v-if` on a normal element                                 | Move `v-if` to a wrapping `<template>`          |
| `template-v-else`                | `*.vue`                | `v-else`/`v-else-if` on a normal element                   | Move it to a wrapping `<template>`              |
| `template-v-for`                 | `*.vue`                | `v-for` on a normal element                                | Move `v-for`+`:key` to a wrapping `<template>`  |
| `template-text`                  | `*.vue`                | text/`{{ }}` on its own row in a non-text element          | Wrap it in `<span>`/`<p>`/… or inline it        |
| `template-props-prefix`          | `*.vue`                | prop read by bare name in template                         | Prefix with `props.`                            |
| `script-section-order`           | `*.vue`                | `<script setup>` statements out of order                   | Reorder to the canonical sequence               |
| `script-define-object`           | `*.vue`                | `define*` uses type-only generic                           | Pass a runtime object instead                   |
| `script-define-const`            | `*.vue`                | `define*` bare / wrong name / `let` / destructured         | `const <conventional name> = define*(…)`        |
| `store-require-name`             | stores¹                | `createStore` config missing `name`                        | Add `name: "<x>"`                               |
| `store-require-model`            | stores¹                | missing `model`                                            | Add a `model()` section                         |
| `store-require-view`             | stores¹                | missing `view`                                             | Add a `view()` section                          |
| `store-require-action`           | stores¹                | missing `action`                                           | Add an `action()` section                       |
| `store-section-function`         | stores¹                | `model`/`view`/`action`/`compose` isn't a function         | Make it a factory function                      |
| `store-section-method`           | stores¹                | section is an arrow / function expression                  | Rewrite as method shorthand                     |
| `store-section-return-shorthand` | stores¹                | section returns inline expressions                         | Assign named consts, return shorthand           |
| `store-config-order`             | stores¹                | keys out of order                                          | Order `name→model→view→action→compose→lazy`     |
| `store-no-unknown-key`           | stores¹                | key not in the allowed set                                 | Remove/rename the stray key                     |
| `store-suffix`                   | stores¹                | `createStore` var not ending in `Store`                    | Rename var to `…Store`                          |
| `store-name-match`               | stores¹                | `name` ≠ var minus `Store`                                 | Set `name` to match the var                     |
| `store-shape-suffix`             | stores¹                | `shape()` result not ending in `Shape`                     | Rename var to `…Shape`                          |
| `store-mode-enum`                | stores¹                | `mode` is a string in a `{ model, mode }` object           | Use `ModelManyMode`/`ModelOneMode` enum         |
| `composable-naming`              | `app/composables/*.ts` | exported composable not `useXxx`                           | Rename to `use` + PascalCase                    |
| `radash-prefer-is`               | `*.ts`,`*.vue`         | `typeof x === "number\|string\|boolean\|function\|symbol"` | radash `isNumber`/`isString`/…                  |
| `radash-prefer-call`             | `*.ts`,`*.vue`         | `Promise.all(…)` / `Array.isArray(…)`                      | radash `all(…)` / `isArray(…)`                  |
| `radash-prefer-clone`            | `*.ts`,`*.vue`         | `JSON.parse(JSON.stringify(x))`                            | radash `clone(x)`                               |
| `radash-prefer-unique`           | `*.ts`,`*.vue`         | `[...new Set(x)]`                                          | radash `unique(x)`                              |
| `radash-prefer-sum`              | `*.ts`,`*.vue`         | `x.reduce((a,b)=>a+b, 0)`                                  | radash `sum(x)`                                 |
| `radash-prefer-sleep`            | `*.ts`,`*.vue`         | `new Promise(r => setTimeout(r, ms))`                      | radash `sleep(ms)`                              |
| `vueuse-prefer-storage`          | `*.ts`,`*.vue` ²       | `localStorage`/`sessionStorage` access                     | `useLocalStorage`/`useSessionStorage`           |
| `vueuse-prefer-member-call`      | `*.ts`,`*.vue` ²       | `.addEventListener` / `.matchMedia`                        | `useEventListener` / `useMediaQuery`            |
| `vueuse-prefer-timer`            | `*.ts`,`*.vue` ²       | `setInterval(…)`                                           | `useIntervalFn(…)`                              |
| `vueuse-prefer-observer`         | `*.ts`,`*.vue` ²       | `new ResizeObserver/IntersectionObserver/MutationObserver` | matching `use*Observer`                         |
| `vueuse-prefer-clipboard`        | `*.ts`,`*.vue` ²       | `navigator.clipboard`                                      | `useClipboard()`                                |
| `vueuse-prefer-route`            | `*.ts`,`*.vue` ²       | `useRoute().query`/`.params`/`.hash`                       | `useRouteQuery`/`useRouteParams`/`useRouteHash` |
| `navigate-to-object`             | `*.ts`,`*.vue`         | `navigateTo("string")`                                     | `navigateTo({ name: … })`                       |
| `multiline-block-padding`        | `*.ts`,`*.vue`         | multi-line sibling statements with no blank line           | Insert a blank line between them                |

¹ **stores** = `app/stores/*.ts` and `app/composables/*.ts`.
² **vueuse** rules fire **only inside a Vue effect scope** — see §6.

---

## 1. Vue templates (`*.vue`)

**Put control-flow directives on a `<template>` wrapper, not on the rendered element.**
`template-v-if`, `template-v-else`, `template-v-for`

```vue
<!-- write -->
<template v-if="isVisible"><div>Content</div></template>

<template v-if="isLoading"><Spinner /></template>
<template v-else><div>Content</div></template>

<template v-for="item in items" :key="item.id">
    <li>{{ item.name }}</li>
</template>

<!-- not -->
<div v-if="isVisible">Content</div>
<div v-else>Content</div>
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

**Wrap standalone text in a semantic inline tag.** Fires when text or `{{ }}` sits _on its
own row_ inside a non-text element (anything but `<span>`/`<p>`/`<h1>`/…). Text kept inline
next to the tags is fine; attribute bindings (`:title="x"`) and directives are not "text".
`template-text`

```vue
<!-- write -->                       <!-- not -->
<div>Hello world</div>               <div>
<div><span>Hello world</span></div>      Hello world
                                     </div>
```

**Read props through the `props` object in templates**, never the auto-exposed bare name.
Prop names come from `defineProps(…)`; `v-for`/`v-slot` locals that shadow a prop are left
alone. `template-props-prefix`

```vue
<div :class="props.icon">{{ props.label }}</div>
<!-- not :class="icon" / {{ label }} -->
```

---

## 2. `<script setup>` structure (`*.vue`)

**Order statements consistently:**
`import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose`.
Macros stay at the top (`defineProps` → `defineModel` → `defineEmits`), `defineExpose` last.
Only `<script setup>` is checked — a sibling plain `<script>` block is free-form.
A section may sit later **only** when its initializer reads an earlier `computed`/`state`/`ref`
(moving it up would throw a TDZ `ReferenceError`) — those are allowed, don't force-reorder.
`script-section-order`

**Describe `define*` macro shapes with a runtime object, not the type-only generic.**
A type annotation alongside the object is fine (`defineModel<Partial<X>>({ … })`). This also
removes any need for `withDefaults()`. `script-define-object`

```ts
const props = defineProps({ editing: { type: Boolean, default: false } }); // not defineProps<{ editing: boolean }>()
const emit = defineEmits({
    submit() {
        return true;
    },
}); // not defineEmits<{ submit: [] }>()
```

**Assign value-returning macros to a `const` with the conventional name:**
`script-define-const`

| Macro         | Const name                                                    |
| ------------- | ------------------------------------------------------------- |
| `defineProps` | `props`                                                       |
| `defineModel` | `model` (or the model name: `defineModel("count")` → `count`) |
| `defineEmits` | `emit`                                                        |
| `defineSlots` | `slots`                                                       |

Never leave the call bare, use `let`/`var`, destructure it, or pick a different name.
(`defineExpose` / `defineOptions` are exempt.)

```ts
// write
const props = defineProps({ … });
const emit = defineEmits({ … });

// not
defineProps({ … }); // bare call — not assigned
const emitter = defineEmits({ … }); // wrong name (should be `emit`)
const p = defineProps({ … }); // wrong name (should be `props`)
```

---

## 3. Harlemify stores (`app/stores/*.ts`, `app/composables/*.ts`)

The canonical `createStore` shape — every store convention converges on this:

```ts
export const accountStore = createStore({
    // var ends in "Store"  → store-suffix
    name: "account", // required; = var minus "Store" → store-require-name, store-name-match
    model({ many }) {
        // method shorthand, factory fn → store-section-function, store-section-method
        const list = many(accountShape); // shape() result ends in "Shape" → store-shape-suffix
        return { list }; // named consts → shorthand object → store-section-return-shorthand
    },
    view({ from }) {
        const list = from("list");
        return { list };
    },
    action({ api }) {
        const get = api.get({ url: "/x" }, { model: "list", mode: ModelManyMode.SET }); // enum not "set" → store-mode-enum
        return { get };
    },
});
```

- **Config must include `name`, `model`, `view`, `action`.**
  `store-require-name` / `-model` / `-view` / `-action`
- **Keys go in order** `name → model → view → action → compose → lazy`, and **only those
  keys are allowed** (no typos / extras like `getters`). `store-config-order`, `store-no-unknown-key`
- **`model`/`view`/`action`/`compose` are factory functions in method shorthand** — not
  plain objects (`model: { … }`) and not arrows (`model: () => …`).
  `store-section-function`, `store-section-method`
- **Each section assigns members to named consts and returns a shorthand object**
  (`const list = many(shape); return { list }`), not inline (`return { list: many(shape) }`).
  `store-section-return-shorthand`
- **Store var ends in `Store`; `name` is that var minus the suffix** (`accountStore` →
  `"account"`). `store-suffix`, `store-name-match`
- **`shape(...)` results end in `Shape`** (`collectionShape = shape(collectionSchema)`).
  `store-shape-suffix`
- **Commit `mode` uses a `ModelManyMode`/`ModelOneMode` enum member, never a string** —
  in any object having both `model` and `mode` (`mode: ModelManyMode.SET`, not `"set"`).
  `store-mode-enum`

---

## 4. Composables (`app/composables/*.ts`)

**Exported composables are named `useXxx`** (`use` + an uppercase letter). Applies to
exported function declarations and arrow/function expressions assigned to a `const`.
`composable-naming`

```ts
export function useAccount() {
    return {};
} // not export function account()
```

---

## 5. Prefer radash over hand-rolled utilities (`*.ts`, `*.vue`)

Reach for [radash](https://radash-docs.vercel.app) helpers instead of reinventing them
(import from `radash`).

| Write                                                                | Instead of                              | Rule                   |
| -------------------------------------------------------------------- | --------------------------------------- | ---------------------- |
| `isString(x)` / `isNumber` / `isBoolean` / `isFunction` / `isSymbol` | `typeof x === "string"` etc.            | `radash-prefer-is`     |
| `all(tasks)`                                                         | `Promise.all(tasks)`                    | `radash-prefer-call`   |
| `isArray(x)`                                                         | `Array.isArray(x)`                      | `radash-prefer-call`   |
| `clone(x)`                                                           | `JSON.parse(JSON.stringify(x))`         | `radash-prefer-clone`  |
| `unique(x)`                                                          | `[...new Set(x)]`                       | `radash-prefer-unique` |
| `sum(x)`                                                             | `x.reduce((a, b) => a + b, 0)`          | `radash-prefer-sum`    |
| `sleep(ms)`                                                          | `new Promise((r) => setTimeout(r, ms))` | `radash-prefer-sleep`  |

---

## 6. Prefer VueUse over raw browser APIs (`*.ts`, `*.vue`)

Use [VueUse](https://vueuse.org) composables — they clean up automatically on scope dispose.

**Scope caveat — these fire only inside a Vue effect scope:** a `.vue` `<script setup>`, a
component `setup()`, or a `use*` composable (where VueUse's `onScopeDispose` cleanup runs).
In plain TS modules, utility functions, or _detached callbacks_ (event handlers like
`el.onopen = …`, `setTimeout`/`setInterval`/`addEventListener` callbacks, `.then`/`.catch`/
`.finally` continuations) the raw API is fine and no warning appears. If you got the warning,
you ARE in an effect scope — apply the composable.

| Write                                                                   | Instead of                                                                 | Rule                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------- |
| `useLocalStorage(key, def)` / `useSessionStorage`                       | `localStorage`/`sessionStorage` access                                     | `vueuse-prefer-storage`     |
| `useEventListener(target, ev, fn)`                                      | `target.addEventListener(ev, fn)`                                          | `vueuse-prefer-member-call` |
| `useMediaQuery(q)`                                                      | `window.matchMedia(q)`                                                     | `vueuse-prefer-member-call` |
| `useIntervalFn(fn, ms)`                                                 | `setInterval(fn, ms)`                                                      | `vueuse-prefer-timer`       |
| `useResizeObserver` / `useIntersectionObserver` / `useMutationObserver` | `new ResizeObserver` / `new IntersectionObserver` / `new MutationObserver` | `vueuse-prefer-observer`    |
| `const { copy } = useClipboard()`                                       | `navigator.clipboard.writeText`                                            | `vueuse-prefer-clipboard`   |
| `useRouteQuery("k")` / `useRouteParams` / `useRouteHash`                | `useRoute().query`/`.params`/`.hash`                                       | `vueuse-prefer-route`       |

Route helpers come from `@vueuse/router`; the rest from `@vueuse/core`. `useRoute().name`
and `.path` have no VueUse equivalent — leave them.

---

## 7. Navigation (`*.ts`, `*.vue`)

**Call `navigateTo` with a route object, not a string** — explicit target, carries
query/params without string building. `navigate-to-object`

```ts
await navigateTo({ name: "dashboard" }); // not navigateTo("/dashboard")
```

The one sanctioned exception: a genuine external redirect that needs a URL string
(`navigateTo(url, { external: true })`) — disable the rule on that line.

---

## 8. Code layout (`*.ts`, `*.vue`)

**Separate multi-line sibling statements with a blank line.** When either of two adjacent
sibling statements spans more than one line, put a blank line between them. Runs of
single-line statements may stay tight. Applies in every statement block. `multiline-block-padding`

Two things stay tight (no blank line): statements already separated by a comment, and a
statement that consumes a variable from a **single-line** declaration directly above it (a
_multi-line_ declaration still earns its blank line).

```ts
const count = ref(0);

const increment = () => {
    count.value++;
};

const other = "other";

// exception — block uses the single-line decl right above it, stays attached
const user = await fetchUser(id);
if (user.isActive) {
    notify(user);
}
```

---

## Reference

- **Namespace** in configs and warnings: `@diphyx/`.
- **Preset** that enables all rules: `diphyx.configs.recommended` in your `eslint.config.mjs`
  (`import diphyx from "@diphyx/eslint-plugin"; export default [...diphyx.configs.recommended]`).
- **Per-rule docs** ship with the package — inside this project at
  `node_modules/@diphyx/eslint-plugin/docs/rules/<rule-id>.md`, and online via each warning's
  `meta.docs.url`.
- **All rules are warnings** and **none auto-fix** — the goal is guidance, not blocking commits.

---

## Verify — install, configure, and run the linter on the target project

Use this to confirm the plugin is wired up correctly and to see the warnings for real.
Adapt the package manager to the project (`pnpm` / `npm` / `yarn`).

**1. Install** (the plugin bundles its own parsers/plugins; you only add `eslint`):

```bash
pnpm add -D @diphyx/eslint-plugin eslint
# npm i -D @diphyx/eslint-plugin eslint   |   yarn add -D @diphyx/eslint-plugin eslint
```

**2. Configure** — flat config only (ESLint 9+, ESM). Create/extend `eslint.config.mjs` at
the project root:

```js
import diphyx from "@diphyx/eslint-plugin";

export default [
    ...diphyx.configs.recommended,

    // project-specific ignores
    {
        ignores: ["node_modules/**", ".nuxt/**", ".output/**", "dist/**", "**/*.d.ts"],
    },
];
```

The `.mjs` extension keeps the `import` working regardless of the project's `package.json`
`"type"` field.

**3. Run** the linter:

```bash
pnpm exec eslint .          # or: npx eslint .
```

Every finding is a **warning** (exit code stays `0`), printed as
`<file>:<line>  warning  <message>  @diphyx/<rule-id>`. Look up the `@diphyx/<rule-id>` in
§0 and fix by hand — `eslint --fix` will not touch these rules.

**4. Verify a single rule / file** while iterating:

```bash
pnpm exec eslint app/stores/account.ts          # one file
pnpm exec eslint . --rule '{"@diphyx/store-name-match":"error"}'   # promote one rule to error to make it stand out
pnpm exec eslint . | grep '@diphyx/'            # only this plugin's findings
```

**5. Sanity-check the setup itself** — if you're unsure the plugin loaded, print the
resolved config for a file and confirm the `@diphyx/*` rules are present:

```bash
pnpm exec eslint --print-config app/app.vue | grep -c '@diphyx/'   # > 0 means the plugin is active
```

**Expected outcome:** ESLint runs without config errors, `@diphyx/*` rules appear in the
printed config, and any convention violations surface as warnings you can resolve using the
sections above. Re-run step 3 after edits until the `@diphyx/*` warnings are gone.
