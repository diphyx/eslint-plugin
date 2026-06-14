// createStore config must include an `action` section.

import { requireKey } from "../utils/store.mjs";

export default requireKey("action", "createStore is missing the 'action' section.");
