# Example app — rule test harness

This `app/` directory is a fixture app that both **dogfoods** the recommended
preset and **tests every rule it configures in both directions** — the 35
`@diphyx` rules plus the 6 third-party rules the preset turns on. Every category
splits its cases into `valid/` and `invalid/` subfolders:

- **`valid/`** — clean code that must produce **zero** warnings (guards against
  false positives). Linted by `pnpm run lint`.
- **`invalid/`** — code that must **trigger** its rule (guards against the rule
  silently breaking). Linted by `pnpm run lint:warnings`.

```bash
pnpm run lint           # valid fixtures + whole repo → expect 0 problems
pnpm run lint:warnings  # invalid fixtures → expect one warning per rule
```

## Layout

```
app/
  stores/{valid,invalid}/        # store-*
  composables/{valid,invalid}/   # composable-naming, multiline, radash-*, vueuse-*
  components/{valid,invalid}/     # template-*, script-* (+ third-party vue rules)
  utils/{valid,invalid}/          # third-party plain-.ts rules
```

| Path                                       | Kind    | Rules covered                                           |
| ------------------------------------------ | ------- | ------------------------------------------------------- |
| `stores/valid/account.ts`                  | valid   | all `store-*`                                           |
| `stores/invalid/store.ts`                  | invalid | all 13 `store-*` (one `createStore`/`shape` block each) |
| `composables/valid/useCounter.ts`          | valid   | `composable-naming`, `multiline-block-padding`          |
| `composables/valid/useExample.ts`          | valid   | `radash-*`, `vueuse-*` (uses the recommended helpers)   |
| `composables/invalid/composable-naming.ts` | invalid | `composable-naming`                                     |
| `composables/invalid/radash.ts`            | invalid | `radash-*`                                              |
| `composables/invalid/vueuse.ts`            | invalid | `vueuse-*` (wrapped in a `useXxx` effect scope)         |
| `composables/invalid/multiline.ts`         | invalid | `multiline-block-padding`                               |
| `composables/valid/navigate.ts`            | valid   | `navigate-to-object`                                    |
| `composables/invalid/navigate.ts`          | invalid | `navigate-to-object`                                    |
| `components/valid/Counter.vue`             | valid   | `template-*`, `script-*`                                |
| `components/invalid/*.vue`                 | invalid | one `template-*` / `script-*` rule each                 |

### Third-party preset rules

The preset also configures rules from other plugins; these fixtures cover them too.

| Path                                     | Kind    | Rules covered                                              |
| ---------------------------------------- | ------- | ---------------------------------------------------------- |
| `utils/valid/preset.ts`                  | valid   | `@typescript-eslint/naming-convention`, `arrow-body-style` |
| `utils/invalid/preset.ts`                | invalid | `@typescript-eslint/naming-convention`, `arrow-body-style` |
| `components/invalid/NoLang.vue`          | invalid | `vue/block-lang`                                           |
| `components/invalid/OptionsApi.vue`      | invalid | `vue/component-api-style`                                  |
| `components/invalid/AttributesOrder.vue` | invalid | `vue/attributes-order`                                     |
| `components/invalid/sampleWidget.vue`    | invalid | `check-file/filename-naming-convention` (camelCase name)   |

The valid side of `vue/block-lang`, `vue/component-api-style`,
`vue/attributes-order` and `check-file/filename-naming-convention` is covered by
`components/valid/Counter.vue` (script-setup + `lang="ts"`, ordered attributes,
PascalCase filename).

### Conventions

- **Every category uses `valid/` and `invalid/` subfolders.** `pnpm run lint`
  ignores `app/**/invalid/**`; `pnpm run lint:warnings` lints only those folders.
- **The published preset is untouched.** It targets `app/stores/*.ts` and
  `app/composables/*.ts` (flat), so to let those rules reach the subfolders the
  local configs broaden just those two globs to `**` — see `eslint.harness.mjs`.
  Consumer projects keep the narrow, flat targeting.
- **`.vue` fixtures keep PascalCase names** (except `sampleWidget.vue`, which is
  intentionally camelCase to trip `check-file/filename-naming-convention`).
- Invalid VueUse statements only warn inside an effect scope, so they live
  inside a `useXxx` composable.

## Adding a rule

1. Add the rule's `❌ Incorrect` example to the matching `invalid/` fixture.
2. Add (or confirm) a `✅ Correct` example in the matching `valid/` fixture.
3. Run both commands above.
