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
