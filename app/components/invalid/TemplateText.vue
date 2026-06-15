<!-- template-text -->
<script setup lang="ts">
const props = defineProps<{ status: string; color: string }>();
</script>

<!-- prettier-ignore -->
<template>
    <div>
        Hello world
    </div>

    <UiBadge :color="props.color">
        {{ props.status }}
    </UiBadge>
</template>
