# composable-naming

> exported composable functions must follow useXxx naming pattern

## Rule Details

This rule flags an exported function (declaration or arrow/function expression assigned to a `const`) whose name does not match the `useXxx` pattern. Composables in `app/composables/*.ts` are expected to start with `use` followed by an uppercase letter.

### ❌ Incorrect

```ts
export function account() {
    return {};
}
```

### ✅ Correct

```ts
export function useAccount() {
    return {};
}
```
