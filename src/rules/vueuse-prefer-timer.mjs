import { isInEffectScope } from "../utils/vue.mjs";

const GLOBAL_CALLS = {
    setInterval: "useIntervalFn",
};

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse timer composables over native timers",
        },
        messages: {
            preferTimer: "Use VueUse '{{helper}}()' instead of '{{native}}()' for auto-cleanup.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (!isInEffectScope(context, node)) {
                    return;
                }

                if (node.callee.type === "Identifier" && GLOBAL_CALLS[node.callee.name]) {
                    context.report({
                        node: node.callee,
                        messageId: "preferTimer",
                        data: { helper: GLOBAL_CALLS[node.callee.name], native: node.callee.name },
                    });
                }
            },
        };
    },
};
