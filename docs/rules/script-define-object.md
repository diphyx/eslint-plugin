# script-define-object

> define\* macros must declare their shape with a runtime object, not the type-only form

## Rule Details

This rule flags a `defineProps` / `defineModel` / `defineEmits` / `defineExpose`
call that has no runtime object argument — i.e. the type-only generic form. The
convention is to describe the shape with a JS object. A type annotation alongside
the object (`defineModel<Partial<Collection>>({ ... })`) is fine because the
object shape is still present.

Because `withDefaults()` only wraps the type-only `defineProps<{ ... }>()`,
sticking to the object form removes the need for `withDefaults` entirely — its
inner `defineProps` is reported by this rule. Declare defaults inline instead:
`defineProps({ size: { type: Number, default: 10 } })`.

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
