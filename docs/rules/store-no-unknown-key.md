# store-no-unknown-key

> createStore config must not contain unknown keys

## Rule Details

This rule flags any `createStore` config key that is not one of the allowed keys: `name`, `model`, `view`, `action`, `compose`, `lazy`. This catches typos and unsupported options.

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
    action() {
        return {};
    },
    getters: {},
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
