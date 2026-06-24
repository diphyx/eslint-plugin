<!-- Regression guard for issue #5: a composable may legitimately depend on an
     earlier computed/ref and must therefore be declared *after* it. The rule
     normally wants composables before computed, but `useTransition` reads its
     source getter synchronously at creation, so moving it above `amount` would
     throw a TDZ ReferenceError. The dependency exception keeps this clean while
     still ordering the independent composable (`useNow`) ahead of the computed. -->
<script setup lang="ts">
import { computed } from "vue";

import { useNow, useTransition } from "@vueuse/core";

const props = defineProps({
    value: { type: Number, default: 0 },
});

const now = useNow();

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

<template>
    <div>{{ now }} {{ tweened }}</div>
</template>
