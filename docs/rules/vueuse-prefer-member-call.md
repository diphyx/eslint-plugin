# vueuse-prefer-member-call

> prefer VueUse composables over raw DOM/window method calls

## Rule Details

This rule flags raw method calls that VueUse wraps with automatic lifecycle cleanup: `.addEventListener(...)` (use `useEventListener`) and `.matchMedia(...)` (use `useMediaQuery`).

### ❌ Incorrect

```ts
window.addEventListener("resize", onResize);
```

### ✅ Correct

```ts
useEventListener(window, "resize", onResize);
```

## Scope

Only reported inside a Vue effect scope. See [VueUse preferences](../../README.md#vueuse-preferences-ts-vue).
