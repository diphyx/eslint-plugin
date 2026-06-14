// @diphyx/eslint-plugin — shared ESLint plugin + flat config for DiPhyx
// Nuxt/Vue + Harlemify projects.

import { createRequire } from "node:module";

import { rules } from "./rules/index.mjs";
import { createConfigs } from "./configs/index.mjs";

const require = createRequire(import.meta.url);
const { name, version } = require("../package.json");

const plugin = {
    meta: {
        name,
        version,
    },
    rules,
};

plugin.configs = createConfigs(plugin);

export default plugin;
