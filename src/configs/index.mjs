import { createRecommended } from "./recommended.mjs";

export function createConfigs(plugin) {
    return {
        recommended: createRecommended(plugin),
    };
}
