// createStore config must include a `model` section.

import { requireKey } from "../utils/store.mjs";

export default requireKey("model", "createStore is missing the 'model' section.");
