<!-- script-define-object: define* macros must use the object form, not type generics -->
<script setup lang="ts">
const props = defineProps<{ editing: boolean }>();

const emit = defineEmits<{ submit: [] }>();
</script>
