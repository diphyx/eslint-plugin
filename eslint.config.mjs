// Self-config: dogfoods the recommended preset on the example app under app/.
// (The plugin's own .mjs source is checked with Prettier.)

import { recommended } from "./eslint.harness.mjs";

export default [
    {
        // Invalid fixtures are intentionally broken for the lint:warnings harness;
        // keep them out of the clean dogfood lint. See app/README.md and
        // eslint.warnings.mjs.
        ignores: ["node_modules/**", "dist/**", "app/**/invalid/**"],
    },

    ...recommended,
];
