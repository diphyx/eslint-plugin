function isSumReducer(node) {
    if (node.type !== "ArrowFunctionExpression" && node.type !== "FunctionExpression") {
        return false;
    }

    if (node.params.length < 2 || node.params[0].type !== "Identifier" || node.params[1].type !== "Identifier") {
        return false;
    }

    let expression = node.body;
    if (expression.type === "BlockStatement") {
        if (expression.body.length !== 1 || expression.body[0].type !== "ReturnStatement") {
            return false;
        }

        expression = expression.body[0].argument;
    }

    if (!expression || expression.type !== "BinaryExpression" || expression.operator !== "+") {
        return false;
    }

    if (expression.left.type !== "Identifier" || expression.right.type !== "Identifier") {
        return false;
    }

    // Require the two operands to be the two *distinct* params (accumulator and
    // element). `acc + acc` ignores the element and is not a sum over the array.
    const [accumulator, element] = [node.params[0].name, node.params[1].name];

    return (
        (expression.left.name === accumulator && expression.right.name === element) ||
        (expression.left.name === element && expression.right.name === accumulator)
    );
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash sum() over a reduce that adds values",
        },
        messages: {
            preferSum: "Use radash 'sum()' instead of a reduce that adds values.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== "MemberExpression" || node.callee.computed) {
                    return;
                }

                if (node.callee.property.type !== "Identifier" || node.callee.property.name !== "reduce") {
                    return;
                }

                const [reducer, initial] = node.arguments;
                if (!reducer || !isSumReducer(reducer)) {
                    return;
                }

                if (initial && !(initial.type === "Literal" && initial.value === 0)) {
                    return;
                }

                context.report({ node: node.callee.property, messageId: "preferSum" });
            },
        };
    },
};
