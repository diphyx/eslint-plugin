# store-config-order

> createStore config keys must follow name → model → view → action → compose → lazy

## Rule Details

This rule flags a `createStore` config key that appears out of the canonical order: name → model → view → action → compose → lazy. Unknown keys are ignored here (they are handled by `store-no-unknown-key`).

### ❌ Incorrect

```ts
const accountStore = createStore({
    model() {
        return {};
    },
    name: "account",
    view() {
        return {};
    },
    action() {
        return {};
    },
});
```

### ✅ Correct

```ts
const accountStore = createStore({
    name: "account",
    model() {
        return {};
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});
```
