// createStore sections must use method shorthand — model({ many }) { ... } —
// not arrow functions or plain function expressions. Whether a section is a
// function at all is left to store-section-function.

import { FUNCTION_SECTIONS, getCreateStoreConfig, getKeyedProperties, isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "createStore sections must use method shorthand, not arrow functions",
        },
        messages: {
            useMethod:
                "createStore '{{section}}' must use method shorthand, e.g. {{section}}() { ... }, not an arrow function.",
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

                    // property.method is only true for method shorthand. Arrow functions
                    // and `model: function () {}` are functions but not shorthand.
                    const value = property.value;
                    const isFunction = value.type === "ArrowFunctionExpression" || value.type === "FunctionExpression";
                    if (isFunction && !property.method) {
                        context.report({
                            node: property.key,
                            messageId: "useMethod",
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
