# script-section-order

> enforce script setup section order (import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose)

## Rule Details

Enforces a fixed order of `<script setup>` statements:

`import` → `props` → `model` → `emit` → `composable` → `state` → `computed` → `watch` → `method` → `lifecycle` → `expose`

Macros keep their own order at the top (`defineProps`, `defineModel`, `defineEmits`), with `defineExpose` last.

### ❌ Incorrect

```vue
<script setup lang="ts">
const emit = defineEmits({
    submit() {
        return true;
    },
});

const props = defineProps({
    editing: {
        type: Boolean,
        default: false,
    },
});

const model = defineModel({
    type: Object,
    required: true,
});
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

const model = defineModel({
    type: Object,
    required: true,
});

const emit = defineEmits({
    submit() {
        return true;
    },
});

const form = useTemplateRef("form");

function submit() {
    emit("submit");
}

defineExpose({
    validate() {
        return form.value?.validate();
    },
});
</script>
```
