<!-- template-props-prefix: props declared via a named type reference
     (defineProps<Props>()) must still be read through `props.` in the template.
     Previously only the inline defineProps<{…}>() literal was resolved, so the
     bare `title` below slipped through. -->
<script setup lang="ts">
interface Props {
    title: string;
}

// eslint-disable-next-line @diphyx/script-define-object -- isolate this fixture to template-props-prefix
const props = defineProps<Props>();
</script>

<template>
    <div>{{ title }}</div>
</template>
