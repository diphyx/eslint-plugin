# radash-prefer-sleep

> prefer radash sleep() over wrapping setTimeout in a Promise

## Rule Details

This rule flags a `new Promise(...)` whose executor wraps a `setTimeout(...)` call, the classic delay idiom, and suggests radash `sleep()` instead.

### ❌ Incorrect

```ts
await new Promise((resolve) => setTimeout(resolve, 1000));
```

### ✅ Correct

```ts
await sleep(1000);
```
