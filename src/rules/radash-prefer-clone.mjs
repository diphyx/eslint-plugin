import { staticMemberName } from "../utils/ast.mjs";

function isJsonStringifyCall(node) {
    return node.type === "CallExpression" && staticMemberName(node.callee) === "JSON.stringify";
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash clone() over JSON.parse(JSON.stringify())",
        },
        messages: {
            preferClone: "Use radash 'clone()' instead of JSON.parse(JSON.stringify(...)).",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (
                    staticMemberName(node.callee) === "JSON.parse" &&
                    node.arguments[0] &&
                    isJsonStringifyCall(node.arguments[0])
                ) {
                    context.report({ node, messageId: "preferClone" });
                }
            },
        };
    },
};
