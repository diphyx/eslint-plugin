<!-- template-props-prefix: props referenced in template must be prefixed with `props.` -->
<script setup lang="ts">
const props = defineProps({
    icon: { type: String, default: "" },
    label: { type: String, default: "" },
});
</script>

<template>
    <div :class="icon">{{ label }}</div>
</template>
