# store-suffix

> store assigned from createStore must use a 'Store' suffix

## Rule Details

This rule flags a variable assigned the result of `createStore(...)` whose name does not end in `Store`. The suffix makes store bindings recognizable at call sites.

### ❌ Incorrect

```ts
const account = createStore({
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
