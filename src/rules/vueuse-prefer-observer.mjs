import { isInEffectScope } from "../utils/vue.mjs";

const CONSTRUCTORS = {
    ResizeObserver: "useResizeObserver",
    IntersectionObserver: "useIntersectionObserver",
    MutationObserver: "useMutationObserver",
};

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse observer composables over raw observers",
        },
        messages: {
            preferObserver: "Use VueUse '{{helper}}()' instead of 'new {{native}}()' for auto-cleanup.",
        },
        schema: [],
    },
    create(context) {
        return {
            NewExpression(node) {
                if (!isInEffectScope(context, node)) {
                    return;
                }

                if (node.callee.type === "Identifier" && CONSTRUCTORS[node.callee.name]) {
                    context.report({
                        node: node.callee,
                        messageId: "preferObserver",
                        data: { helper: CONSTRUCTORS[node.callee.name], native: node.callee.name },
                    });
                }
            },
        };
    },
};
