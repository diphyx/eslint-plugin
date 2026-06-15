<!-- template-v-else -->
<script setup lang="ts">
const isLoading = true;
</script>

<template>
    <template v-if="isLoading">
        <Spinner />
    </template>
    <div v-else>Content</div>
</template>
