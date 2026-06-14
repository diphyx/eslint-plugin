# script-section-order

> enforce script setup section order (import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose)

## Rule Details

This rule enforces a fixed ordering of `<script setup>` statements:

`import` → `props` → `model` → `emit` → `composable` → `state` → `computed` → `watch` → `method` → `lifecycle` → `expose`

The compiler macros have their own fixed order within the top of the block —
`defineProps`, then `defineModel`, then `defineEmits` — while `defineExpose`
always comes last. The rule classifies each top-level statement and reports one
that appears before a section that should come earlier.

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
