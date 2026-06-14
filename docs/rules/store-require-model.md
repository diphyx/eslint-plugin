# store-require-model

> createStore config must include 'model'

## Rule Details

This rule flags a `createStore({ ... })` call whose config object is missing the required `model` section. Harlemify's `StoreConfig` requires `model` as a factory section.

### ❌ Incorrect

```ts
const accountStore = createStore({
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
