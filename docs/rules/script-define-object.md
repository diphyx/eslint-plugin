# script-define-object

> define\* macros must declare their shape with a runtime object, not the type-only form

## Rule Details

Flags a `defineProps` / `defineModel` / `defineEmits` / `defineExpose` call with no runtime object argument (the type-only generic form); describe the shape with a JS object instead. A type annotation alongside the object (`defineModel<Partial<Collection>>({ ... })`) is fine. Sticking to the object form also removes the need for `withDefaults()`.

### ❌ Incorrect

```vue
<script setup lang="ts">
const props = defineProps<{ editing: boolean }>();

const emit = defineEmits<{ submit: [] }>();
</script>
```

### ✅ Correct

```vue
<script setup lang="ts">
const props = defineProps({
    editing: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits({
    submit() {
        return true;
    },
});
</script>
```
