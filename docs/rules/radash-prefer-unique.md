# radash-prefer-unique

> prefer radash unique() over spreading a new Set

## Rule Details

This rule flags the `[...new Set(...)]` deduplication idiom (an array literal whose only element spreads a `new Set(...)`) and suggests radash `unique()` instead.

### ❌ Incorrect

```ts
const deduped = [...new Set(items)];
```

### ✅ Correct

```ts
const deduped = unique(items);
```
