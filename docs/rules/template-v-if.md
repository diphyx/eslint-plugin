# template-v-if

> v-if must be used on a `<template>` wrapper

## Rule Details

This rule flags any non-`<template>` element that carries a `v-if` directive. DiPhyx convention is to put conditional rendering on a `<template>` wrapper so the condition stays separate from the element's own attributes.

### ❌ Incorrect

```vue
<template>
    <div v-if="isVisible">Content</div>
</template>
```

### ✅ Correct

```vue
<template>
    <template v-if="isVisible">
        <div>Content</div>
    </template>
</template>
```
