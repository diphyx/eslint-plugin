# script-define-const

> define\* macros must be assigned to a const with the conventional name

## Rule Details

The value-returning macros `defineProps` / `defineModel` / `defineEmits` / `defineSlots` must be assigned to a `const` with the conventional name:

| Macro         | Const name                                                         |
| ------------- | ------------------------------------------------------------------ |
| `defineProps` | `props`                                                            |
| `defineModel` | `model` (or the model name, e.g. `defineModel("count")` → `count`) |
| `defineEmits` | `emit`                                                             |
| `defineSlots` | `slots`                                                            |

A bare call, a `let`/`var` binding, a destructured binding, or a wrong name is reported. `defineExpose` / `defineOptions` are not covered.

### ❌ Incorrect

```vue
<script setup lang="ts">
// bare call — not assigned
defineProps({
    icon: {
        type: String,
        default: "i-mingcute:storage-line",
    },
});

// wrong name
const p = defineProps({ editing: { type: Boolean, default: false } });

// wrong name for emit
const emitter = defineEmits({ submit: () => true });
</script>
```

### ✅ Correct

```vue
<script setup lang="ts">
const props = defineProps({
    icon: {
        type: String,
        default: "i-mingcute:storage-line",
    },
});

const emit = defineEmits({
    submit() {
        return true;
    },
});

const model = defineModel({ type: String });
</script>
```
