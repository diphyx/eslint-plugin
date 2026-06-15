// Valid counterpart to composables/invalid/composable-naming.ts and
// composables/invalid/multiline.ts: a composable that follows the conventions
// (useXxx naming, explicit arrow-function bodies, blank-line padding), so
// `pnpm run lint` reports zero warnings here. ref is auto-imported in Nuxt,
// mirroring how consumer apps are written.
export const useCounter = () => {
    const count = ref(0);

    const increment = () => {
        count.value++;
    };

    const reset = () => {
        count.value = 0;
    };

    return { count, increment, reset };
};
