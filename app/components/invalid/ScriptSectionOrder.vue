<!-- script-section-order: defineProps/defineEmits/defineModel must follow the canonical order -->
<script setup lang="ts">
const emit = defineEmits({
    submit() {
        return true;
    },
});

const props = defineProps({
    editing: {
        type: Boolean,
        default: false,
    },
});

const model = defineModel({
    type: Object,
    required: true,
});
</script>
