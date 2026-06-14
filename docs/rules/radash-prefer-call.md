# radash-prefer-call

> prefer radash helpers over native global calls

## Rule Details

This rule flags native global calls that radash wraps, namely `Promise.all(...)` (use `all`) and `Array.isArray(...)` (use `isArray`).

### ❌ Incorrect

```ts
const results = await Promise.all(tasks);
```

### ✅ Correct

```ts
const results = await all(tasks);
```
