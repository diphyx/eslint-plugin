# store-shape-suffix

> shape() result must use a 'Shape' suffix

## Rule Details

This rule flags a variable assigned the result of a `shape(...)` call whose name does not end in `Shape`. `shape()` defines a store model's shape, so the suffix keeps those definitions easy to identify.

### ❌ Incorrect

```ts
export const collection = shape(collectionSchema);
```

### ✅ Correct

```ts
export const collectionShape = shape(collectionSchema);
```
