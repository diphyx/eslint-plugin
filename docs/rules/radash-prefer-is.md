# radash-prefer-is

> prefer radash is\* helpers over typeof comparisons

## Rule Details

This rule flags a `typeof x === "..."` (or `!==`) comparison against `number`, `string`, `boolean`, `function`, or `symbol`, suggesting the matching radash helper (`isNumber`, `isString`, etc.).

### ❌ Incorrect

```ts
if (typeof value === "string") {
    // ...
}
```

### ✅ Correct

```ts
if (isString(value)) {
    // ...
}
```
