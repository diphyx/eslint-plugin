// Prefer radash sleep() over wrapping setTimeout in a Promise.

function isSetTimeoutCall(node) {
    return (
        Boolean(node) &&
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "setTimeout"
    );
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash sleep() over wrapping setTimeout in a Promise",
        },
        messages: {
            preferSleep: "Use radash 'sleep()' instead of wrapping setTimeout in a Promise.",
        },
        schema: [],
    },
    create(context) {
        return {
            NewExpression(node) {
                if (node.callee.type !== "Identifier" || node.callee.name !== "Promise") {
                    return;
                }

                const executor = node.arguments[0];
                if (
                    !executor ||
                    (executor.type !== "ArrowFunctionExpression" && executor.type !== "FunctionExpression")
                ) {
                    return;
                }

                const body = executor.body;
                const wrapsSetTimeout =
                    isSetTimeoutCall(body) ||
                    (body.type === "BlockStatement" &&
                        body.body.some(
                            (statement) =>
                                statement.type === "ExpressionStatement" && isSetTimeoutCall(statement.expression),
                        ));

                if (wrapsSetTimeout) {
                    context.report({ node, messageId: "preferSleep" });
                }
            },
        };
    },
};
