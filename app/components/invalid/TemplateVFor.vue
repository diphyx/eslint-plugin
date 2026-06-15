<!-- template-v-for -->
<script setup lang="ts">
const items = [{ id: 1, name: "a" }];
</script>

<template>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</template>
