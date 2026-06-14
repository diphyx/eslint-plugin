# store-mode-enum

> store action 'mode' must use a ModelMode enum, not a string literal

## Rule Details

This rule flags a commit-options object that pairs a `model` property with a `mode` property whose value is a raw string literal. The `mode` should use a `ModelManyMode` / `ModelOneMode` enum member instead of a string.

### ❌ Incorrect

```ts
factory.commit({ model: users, mode: "set" });
```

### ✅ Correct

```ts
factory.commit({ model: users, mode: ModelManyMode.SET });
```
