// vueuse-* rules: prefer VueUse composables over raw browser APIs.
// These rules only fire inside an effect scope (setup or a useXxx composable),
// so the examples live inside useDemo().
export const useDemo = () => {
    // vueuse-prefer-storage: prefer useLocalStorage over localStorage
    const theme = localStorage.getItem("theme");

    // vueuse-prefer-member-call: prefer useEventListener over addEventListener
    window.addEventListener("resize", onResize);

    // vueuse-prefer-timer: prefer useIntervalFn over setInterval
    setInterval(() => tick(), 1000);

    // vueuse-prefer-observer: prefer useResizeObserver over new ResizeObserver
    const observer = new ResizeObserver(onResize);

    // vueuse-prefer-clipboard: prefer useClipboard over navigator.clipboard
    navigator.clipboard.writeText(text);

    // vueuse-prefer-route: prefer useRouteQuery over reading route.query directly
    const route = useRoute();
    const page = route.query.page;

    return { theme, observer, page };
};
