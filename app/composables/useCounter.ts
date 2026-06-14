// Example composable demonstrating the conventions enforced by the plugin:
// useXxx naming and explicit arrow-function bodies. (ref is auto-imported in
// Nuxt, mirroring how consumer apps are written.)
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
