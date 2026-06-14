# vueuse-prefer-clipboard

> prefer VueUse useClipboard over navigator.clipboard

## Rule Details

This rule flags direct access to `navigator.clipboard` and suggests the VueUse `useClipboard` composable.

### ❌ Incorrect

```ts
await navigator.clipboard.writeText(text);
```

### ✅ Correct

```ts
const { copy } = useClipboard();
await copy(text);
```

## Scope

Only reported inside a Vue effect scope. See [VueUse preferences](../../README.md#vueuse-preferences-ts-vue).
