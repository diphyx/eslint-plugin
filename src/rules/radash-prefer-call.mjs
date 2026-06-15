import { staticMemberName } from "../utils/ast.mjs";

const GLOBAL_CALLS = {
    "Promise.all": "all",
    "Array.isArray": "isArray",
};

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer radash helpers over native global calls",
        },
        messages: {
            preferCall: "Use radash '{{helper}}()' instead of '{{native}}()'.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                const name = staticMemberName(node.callee);
                const helper = name && GLOBAL_CALLS[name];
                if (helper) {
                    context.report({ node: node.callee, messageId: "preferCall", data: { helper, native: name } });
                }
            },
        };
    },
};
