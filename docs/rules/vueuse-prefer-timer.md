# vueuse-prefer-timer

> prefer VueUse timer composables over native timers

## Rule Details

This rule flags a `setInterval(...)` call and suggests VueUse `useIntervalFn`, which handles automatic cleanup on unmount.

### ❌ Incorrect

```ts
setInterval(() => tick(), 1000);
```

### ✅ Correct

```ts
useIntervalFn(() => tick(), 1000);
```
