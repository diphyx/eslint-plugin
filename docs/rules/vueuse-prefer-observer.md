# vueuse-prefer-observer

> prefer VueUse observer composables over raw observers

## Rule Details

This rule flags `new ResizeObserver(...)`, `new IntersectionObserver(...)`, and `new MutationObserver(...)`, suggesting the matching VueUse composable (`useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`) for automatic cleanup.

### ❌ Incorrect

```ts
const observer = new ResizeObserver(onResize);
```

### ✅ Correct

```ts
useResizeObserver(target, onResize);
```
