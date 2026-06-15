// Warnings harness: lints the intentionally-invalid fixtures so every rule's
// warning can be seen firing. Run with `pnpm run lint:warnings`. Unlike
// eslint.config.mjs, this config does NOT ignore the invalid fixtures.

import { recommended } from "./eslint.harness.mjs";

export default [
    {
        ignores: ["node_modules/**", "dist/**"],
    },

    ...recommended,
];
