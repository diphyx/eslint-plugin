# store-section-function

> createStore model/view/action/compose sections must be factory functions

## Rule Details

This rule flags a `model`, `view`, `action`, or `compose` section of a `createStore` config whose value is not a function. These sections must be factory functions (written as method shorthand — see `store-section-method`) that receive the section helper and return the section object.

### ❌ Incorrect

```ts
const accountStore = createStore({
    name: "account",
    model: { list: null },
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
