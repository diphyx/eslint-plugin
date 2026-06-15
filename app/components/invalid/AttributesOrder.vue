<!-- vue/attributes-order: static attributes must come before event handlers -->
<script setup lang="ts">
function onClick() {
    return true;
}
</script>

<template>
    <button @click="onClick" type="button"></button>
</template>
