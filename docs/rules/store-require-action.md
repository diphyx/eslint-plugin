# store-require-action

> createStore config must include 'action'

## Rule Details

This rule flags a `createStore({ ... })` call whose config object is missing the required `action` section. Harlemify's `StoreConfig` requires `action` as a factory section.

### ❌ Incorrect

```ts
const accountStore = createStore({
    name: "account",
    model() {
        return {};
    },
    view() {
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
