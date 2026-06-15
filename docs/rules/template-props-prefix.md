# template-props-prefix

> props must be read via the `props` object in the template, not the bare binding

## Rule Details

`<script setup>` auto-exposes each prop under its own name, so `{{ icon }}` works. This rule requires reading props through the `props` object instead (`{{ props.icon }}`), pairing with [`script-define-const`](./script-define-const.md). Prop names come from the `defineProps(...)` call; template-local bindings that shadow a prop (`v-for` / `v-slot`) are left alone.

### ❌ Incorrect

```vue
<script setup lang="ts">
const props = defineProps({
    icon: { type: String, default: "" },
    label: { type: String, default: "" },
});
</script>

<template>
    <div :class="icon">{{ label }}</div>
</template>
```

### ✅ Correct

```vue
<script setup lang="ts">
const props = defineProps({
    icon: { type: String, default: "" },
    label: { type: String, default: "" },
});
</script>

<template>
    <div :class="props.icon">{{ props.label }}</div>
</template>
```
