# store-name-match

> createStore name should match the store variable (accountStore → 'account')

## Rule Details

This rule flags a `createStore` whose `name` string literal does not match the variable it is assigned to, with the `Store` suffix removed. For example, `accountStore` is expected to have `name: "account"`.

### ❌ Incorrect

```ts
const accountStore = createStore({
    name: "user",
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
