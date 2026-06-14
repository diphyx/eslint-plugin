# store-require-name

> createStore config must include 'name'

## Rule Details

This rule flags a `createStore({ ... })` call whose config object is missing the required `name` property. Harlemify's `StoreConfig` requires `name` to identify the store.

### ❌ Incorrect

```ts
const accountStore = createStore({
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
