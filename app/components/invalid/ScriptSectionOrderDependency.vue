<!-- script-section-order: a composable that does NOT depend on the earlier
     computed is freely reorderable, so it must still report "composable should
     come after computed" — the issue #5 dependency exception must not suppress
     genuinely out-of-order sections. -->
<script setup lang="ts">
import { computed } from "vue";

import { useNow } from "@vueuse/core";

const total = computed(() => {
    return 1 + 2;
});

const now = useNow();
</script>
