# template-v-else

> v-else / v-else-if must be used on a `<template>` wrapper

## Rule Details

This rule flags any non-`<template>` element that carries a `v-else` or `v-else-if` directive. DiPhyx convention is to put conditional branches on a `<template>` wrapper.

### ❌ Incorrect

```vue
<template>
    <template v-if="isLoading">
        <Spinner />
    </template>
    <div v-else>Content</div>
</template>
```

### ✅ Correct

```vue
<template>
    <template v-if="isLoading">
        <Spinner />
    </template>
    <template v-else>
        <div>Content</div>
    </template>
</template>
```
