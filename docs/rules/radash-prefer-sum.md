# radash-prefer-sum

> prefer radash sum() over a reduce that adds values

## Rule Details

This rule flags a `.reduce(...)` call whose reducer simply adds its two arguments (`(a, b) => a + b`), optionally with an initial value of `0`, and suggests radash `sum()` instead.

### ❌ Incorrect

```ts
const total = values.reduce((a, b) => a + b, 0);
```

### ✅ Correct

```ts
const total = sum(values);
```
