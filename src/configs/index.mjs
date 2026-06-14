// Ready-to-use flat config presets. `createConfigs(plugin)` is called from the
// package entry so each preset can register the plugin under the "@diphyx"
// namespace.

import { createRecommended } from "./recommended.mjs";

export function createConfigs(plugin) {
    return {
        recommended: createRecommended(plugin),
    };
}
