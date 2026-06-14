# vueuse-prefer-storage

> prefer VueUse useLocalStorage/useSessionStorage over raw Web Storage

## Rule Details

This rule flags direct access to `localStorage` or `sessionStorage` (bare or via `window` / `globalThis`) and suggests the reactive VueUse `useLocalStorage` / `useSessionStorage` composables.

### ❌ Incorrect

```ts
const theme = localStorage.getItem("theme");
```

### ✅ Correct

```ts
const theme = useLocalStorage("theme", "light");
```
