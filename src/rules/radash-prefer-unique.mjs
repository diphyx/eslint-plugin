export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash unique() over spreading a new Set",
        },
        messages: {
            preferUnique: "Use radash 'unique()' instead of spreading a 'new Set(...)'.",
        },
        schema: [],
    },
    create(context) {
        return {
            ArrayExpression(node) {
                const only = node.elements.length === 1 ? node.elements[0] : null;
                if (
                    only &&
                    only.type === "SpreadElement" &&
                    only.argument.type === "NewExpression" &&
                    only.argument.callee.type === "Identifier" &&
                    only.argument.callee.name === "Set"
                ) {
                    context.report({ node, messageId: "preferUnique" });
                }
            },
        };
    },
};
