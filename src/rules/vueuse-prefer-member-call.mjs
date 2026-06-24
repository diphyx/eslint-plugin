import { isInEffectScope } from "../utils/vue.mjs";

const MEMBER_CALLS = Object.assign(Object.create(null), {
    addEventListener: "useEventListener",
    matchMedia: "useMediaQuery",
});

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse composables over raw DOM/window method calls",
        },
        messages: {
            preferMemberCall: "Use VueUse '{{helper}}()' instead of '{{native}}()' for auto-cleanup.",
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (!isInEffectScope(context, node)) {
                    return;
                }

                const callee = node.callee;
                if (callee.type !== "MemberExpression" || callee.computed || callee.property.type !== "Identifier") {
                    return;
                }

                const helper = MEMBER_CALLS[callee.property.name];
                if (helper) {
                    context.report({
                        node: callee.property,
                        messageId: "preferMemberCall",
                        data: { helper, native: callee.property.name },
                    });
                }
            },
        };
    },
};
