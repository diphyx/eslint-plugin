// createStore config must include a `view` section.

import { requireKey } from "../utils/store.mjs";

export default requireKey("view", "createStore is missing the 'view' section.");
