<!-- #6 boundary check must stay narrow: a raw Web Storage access at the top of
     <script setup> runs synchronously in the setup scope, so it must still be
     flagged (vueuse-prefer-storage). Guards the .vue effect-scope path. -->
<script setup lang="ts">
const theme = localStorage.getItem("theme");
</script>

<template>
    <div>{{ theme }}</div>
</template>
