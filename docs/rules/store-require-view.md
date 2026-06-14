# store-require-view

> createStore config must include 'view'

## Rule Details

This rule flags a `createStore({ ... })` call whose config object is missing the required `view` section. Harlemify's `StoreConfig` requires `view` as a factory section.

### ❌ Incorrect

```ts
const accountStore = createStore({
    name: "account",
    model() {
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
