<!-- Valid counterpart to components/invalid/*.vue: a clean component that all
     template/script rules accept, so `pnpm run lint` reports zero warnings. -->
<script setup lang="ts">
const props = defineProps({
    label: { type: String, default: "" },
    items: {
        type: Array,
        default() {
            return [];
        },
    },
});

const model = defineModel({ type: Number, required: true });

const emit = defineEmits({
    submit() {
        return true;
    },
});

function increment() {
    model.value++;

    emit("submit");
}
</script>

<template>
    <div>
        <span>{{ props.label }}</span>

        <template v-if="model > 0">
            <button @click="increment">{{ model }}</button>
        </template>
        <template v-else>
            <span>empty</span>
        </template>

        <template v-for="item in props.items" :key="item">
            <li>{{ item }}</li>
        </template>
    </div>
</template>
