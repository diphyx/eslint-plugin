// createStore config keys must follow name → model → view → action → compose → lazy.

import { SECTION_ORDER, getCreateStoreConfig, getKeyedProperties, isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "createStore config keys must follow name → model → view → action → compose → lazy",
        },
        messages: {
            outOfOrder: "createStore '{{current}}' should come before '{{previous}}'.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (!isCreateStoreCall(node)) {
                    return;
                }

                const config = getCreateStoreConfig(node);
                if (!config) {
                    return;
                }

                let lastIndex = -1;
                let lastKey = null;

                for (const property of getKeyedProperties(config)) {
                    const index = SECTION_ORDER.indexOf(property.key.name);
                    if (index === -1) {
                        // Unknown keys are handled by store-no-unknown-key.
                        continue;
                    }

                    if (index < lastIndex) {
                        context.report({
                            node: property,
                            messageId: "outOfOrder",
                            data: {
                                current: property.key.name,
                                previous: lastKey,
                            },
                        });
                    } else {
                        lastIndex = index;
                        lastKey = property.key.name;
                    }
                }
            },
        };
    },
};
