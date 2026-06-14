# radash-prefer-clone

> prefer radash clone() over JSON.parse(JSON.stringify())

## Rule Details

This rule flags the `JSON.parse(JSON.stringify(...))` deep-clone idiom and suggests radash `clone()` instead.

### ❌ Incorrect

```ts
const copy = JSON.parse(JSON.stringify(source));
```

### ✅ Correct

```ts
const copy = clone(source);
```
