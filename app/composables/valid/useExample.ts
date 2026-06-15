// Valid counterpart to composables/invalid/radash.ts and
// composables/invalid/vueuse.ts: uses the radash/VueUse helpers the rules
// recommend, so `pnpm run lint` reports zero warnings here. VueUse rules only
// apply inside an effect scope, hence the useXxx composable.
import { all, clone, isString, sleep, sum, unique } from "radash";

import {
    useClipboard,
    useEventListener,
    useIntervalFn,
    useLocalStorage,
    useResizeObserver,
    useRouteQuery,
} from "@vueuse/core";

export const useExample = async () => {
    // radash-prefer-* — helpers instead of the hand-rolled forms
    const results = await all(tasks);
    const total = sum(values);
    const deduped = unique(items);
    const copy = clone(source);

    if (isString(value)) {
        await sleep(1000);
    }

    // vueuse-prefer-* — composables instead of raw browser APIs
    const theme = useLocalStorage("theme", "light");
    const page = useRouteQuery("page");

    useEventListener(window, "resize", onResize);
    useResizeObserver(target, onResize);

    useIntervalFn(() => {
        tick();
    }, 1000);

    const { copy: copyText } = useClipboard();

    await copyText(text);

    return { results, total, deduped, copy, theme, page };
};
