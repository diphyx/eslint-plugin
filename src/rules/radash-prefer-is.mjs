// Prefer radash is* helpers over `typeof` comparisons.

const TYPEOF_HELPERS = {
    number: "isNumber",
    string: "isString",
    boolean: "isBoolean",
    function: "isFunction",
    symbol: "isSymbol",
};

// typeof x === "<type>" → the compared type string, or null.
function getTypeofComparison(node) {
    if (node.operator !== "===" && node.operator !== "!==") {
        return null;
    }

    const typeofSide = [node.left, node.right].find(
        (side) => side.type === "UnaryExpression" && side.operator === "typeof",
    );
    const literalSide = [node.left, node.right].find((side) => side.type === "Literal");

    if (!typeofSide || !literalSide || typeof literalSide.value !== "string") {
        return null;
    }

    return literalSide.value;
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash is* helpers over typeof comparisons",
        },
        messages: {
            preferIs: "Use radash '{{helper}}()' instead of a 'typeof' comparison.",
        },
        schema: [],
    },
    create(context) {
        return {
            BinaryExpression(node) {
                const type = getTypeofComparison(node);
                const helper = type && TYPEOF_HELPERS[type];
                if (helper) {
                    context.report({ node, messageId: "preferIs", data: { helper } });
                }
            },
        };
    },
};
