<!-- script-define-const: define* macros must be assigned to canonically-named consts -->
<script setup lang="ts">
// bare call — not assigned
defineProps({
    icon: {
        type: String,
        default: "i-mingcute:storage-line",
    },
});

// wrong name
const p = defineProps({ editing: { type: Boolean, default: false } });

// wrong name for emit
const emitter = defineEmits({ submit: () => true });
</script>
