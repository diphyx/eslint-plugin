// Self-config: dogfoods the recommended preset on the example app under app/.
// (The plugin's own .mjs source is checked with Prettier.)

import diphyx from "./src/index.mjs";

export default [
    {
        ignores: ["node_modules/**", "dist/**"],
    },

    ...diphyx.configs.recommended,
];
