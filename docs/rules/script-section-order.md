# script-section-order

> enforce script setup section order (import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose)

## Rule Details

Enforces a fixed order of `<script setup>` statements:

`import` → `props` → `model` → `emit` → `composable` → `state` → `computed` → `watch` → `method` → `lifecycle` → `expose`

Macros keep their own order at the top (`defineProps`, `defineModel`, `defineEmits`), with `defineExpose` last.

Only `<script setup>` is checked — a sibling module `<script>` block is free-form and never seeds the order.

A section may sit out of order when a later section forces it to: if its initializer reads an earlier `computed`/`state`/`ref` binding, moving it up would throw a TDZ `ReferenceError`, so it is not reported (see [Forced by a dependency](#-forced-by-a-dependency)).

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

### ✅ Forced by a dependency

A composable that reads an earlier `computed` must follow it — `useTransition` evaluates its source getter synchronously, so the reverse order would throw a TDZ `ReferenceError`. Not reported:

```vue
<script setup lang="ts">
const amount = computed(() => {
    return props.value ?? 0;
});

const tweened = useTransition(
    () => {
        return amount.value;
    },
    {
        duration: 500,
    },
);
</script>
```
