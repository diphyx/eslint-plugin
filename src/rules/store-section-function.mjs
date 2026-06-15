import { FUNCTION_SECTIONS, getCreateStoreConfig, getKeyedProperties, isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "problem",
        docs: {
            description: "createStore model/view/action/compose sections must be factory functions",
        },
        messages: {
            notFunction: "createStore '{{section}}' must be a factory function, e.g. ({{section}}) => ({ ... }).",
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
                    if (!FUNCTION_SECTIONS.has(property.key.name)) {
                        continue;
                    }

                    const value = property.value;
                    if (value.type !== "ArrowFunctionExpression" && value.type !== "FunctionExpression") {
                        context.report({
                            node: property,
                            messageId: "notFunction",
                            data: {
                                section: property.key.name,
                            },
                        });
                    }
                }
            },
        };
    },
};
