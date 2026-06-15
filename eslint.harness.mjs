// Shared base for the local lint configs (eslint.config.mjs + eslint.warnings.mjs).
//
// The published preset (src/configs/recommended.mjs) targets `app/stores/*.ts`
// and `app/composables/*.ts` — flat, single-level — so consumer projects only
// apply store/composable rules to files directly in those folders. The fixture
// app organizes its cases under valid/ and invalid/ subfolders, so HERE (and only
// here) we broaden those two globs to `**` so the rules reach the fixtures. The
// published preset is left untouched.

import diphyx from "./src/index.mjs";

const BROADEN = {
    "app/stores/*.ts": "app/stores/**/*.ts",
    "app/composables/*.ts": "app/composables/**/*.ts",
};

export const recommended = diphyx.configs.recommended.map((block) => {
    if (!Array.isArray(block.files)) {
        return block;
    }

    return {
        ...block,
        files: block.files.map((glob) => BROADEN[glob] ?? glob),
    };
});
