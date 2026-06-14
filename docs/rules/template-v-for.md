# template-v-for

> v-for must be used on a `<template>` wrapper

## Rule Details

This rule flags any non-`<template>` element that carries a `v-for` directive. DiPhyx convention is to put list rendering on a `<template>` wrapper so iteration is separated from the rendered element.

### ❌ Incorrect

```vue
<template>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</template>
```

### ✅ Correct

```vue
<template>
    <template v-for="item in items" :key="item.id">
        <li>{{ item.name }}</li>
    </template>
</template>
```
