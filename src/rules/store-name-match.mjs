import { findProperty, getCreateStoreConfig, isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "createStore name should match the store variable (accountStore → 'account')",
        },
        messages: {
            mismatch: "createStore name '{{name}}' should match the store variable, expected '{{expected}}'.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (!isCreateStoreCall(node)) {
                    return;
                }

                const parent = node.parent;
                if (!parent || parent.type !== "VariableDeclarator" || parent.id.type !== "Identifier") {
                    return;
                }

                const config = getCreateStoreConfig(node);
                if (!config) {
                    return;
                }

                const nameProperty = findProperty(config, "name");
                if (
                    !nameProperty ||
                    nameProperty.value.type !== "Literal" ||
                    typeof nameProperty.value.value !== "string"
                ) {
                    return;
                }

                const expected = parent.id.name.replace(/Store$/, "");
                if (nameProperty.value.value !== expected) {
                    context.report({
                        node: nameProperty.value,
                        messageId: "mismatch",
                        data: {
                            name: nameProperty.value.value,
                            expected,
                        },
                    });
                }
            },
        };
    },
};
