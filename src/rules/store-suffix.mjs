// A store assigned from createStore must use a `Store` suffix.

import { isCreateStoreCall } from "../utils/store.mjs";

export default {
    meta: {
        type: "problem",
        docs: {
            description: "store assigned from createStore must use a 'Store' suffix",
        },
        messages: {
            invalidName: "Store assigned to '{{name}}' should use a 'Store' suffix (e.g. accountStore).",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (!isCreateStoreCall(node)) {
                    return;
                }

                // const accountStore = createStore({ ... })
                const parent = node.parent;
                if (parent && parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
                    if (!/Store$/.test(parent.id.name)) {
                        context.report({
                            node: parent.id,
                            messageId: "invalidName",
                            data: {
                                name: parent.id.name,
                            },
                        });
                    }
                }
            },
        };
    },
};
