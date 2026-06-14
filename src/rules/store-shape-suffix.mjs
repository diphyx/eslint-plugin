// shape() result must be named with a 'Shape' suffix, e.g.
//   export const collectionShape = shape(collectionSchema)

export default {
    meta: {
        type: "problem",
        docs: {
            description: "shape() result must use a 'Shape' suffix",
        },
        messages: {
            invalidName: "shape() assigned to '{{name}}' should use a 'Shape' suffix (e.g. collectionShape).",
        },
        schema: [],
    },
    create(context) {
        return {
            VariableDeclarator(node) {
                if (
                    node.init &&
                    node.init.type === "CallExpression" &&
                    node.init.callee.type === "Identifier" &&
                    node.init.callee.name === "shape" &&
                    node.id.type === "Identifier" &&
                    !/Shape$/.test(node.id.name)
                ) {
                    context.report({
                        node: node.id,
                        messageId: "invalidName",
                        data: {
                            name: node.id.name,
                        },
                    });
                }
            },
        };
    },
};
