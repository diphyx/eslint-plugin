// createStore config must include a `name` property.

import { requireKey } from "../utils/store.mjs";

export default requireKey("name", "createStore is missing the required 'name' property.");
