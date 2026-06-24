<!-- Regression guard for issue #4: a module <script> block must not seed the
     ordering state of <script setup>. The plain block below defines a `method`
     (function) and `state` (ref), which previously made every section in the
     correctly-ordered setup block report "should come after 'method'". The rule
     now scopes its check to the <script setup> range, so this stays clean. -->
<script lang="ts">
import { ref } from "vue";

const registry: symbol[] = [];

const shared = ref(0);

function register(id: symbol) {
    registry.push(id);
}
</script>

<script setup lang="ts">
const props = defineProps({
    label: { type: String, default: "" },
});

const model = defineModel({ type: Number, required: true });

const doubled = computed(() => {
    return model.value * 2;
});

function increment() {
    register(Symbol());

    shared.value++;

    model.value++;
}
</script>

<template>
    <div>
        <span>{{ props.label }}</span>

        <button @click="increment">{{ doubled }}</button>
    </div>
</template>
