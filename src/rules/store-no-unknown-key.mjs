import { ALLOWED_KEYS, getCreateStoreConfig, getKeyedProperties, isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "problem",
        docs: {
            description: "createStore config must not contain unknown keys",
        },
        messages: {
            unknown: "Unknown createStore key '{{key}}'. Allowed: name, model, view, action, compose, lazy.",
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

                for (const property of getKeyedProperties(config)) {
                    if (!ALLOWED_KEYS.has(property.key.name)) {
                        context.report({
                            node: property.key,
                            messageId: "unknown",
                            data: {
                                key: property.key.name,
                            },
                        });
                    }
                }
            },
        };
    },
};
