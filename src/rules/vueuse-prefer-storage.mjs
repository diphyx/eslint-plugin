import { isInEffectScope } from "../utils/vue.mjs";

const MEMBER_ACCESS = {
    localStorage: "useLocalStorage",
    sessionStorage: "useSessionStorage",
};

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse useLocalStorage/useSessionStorage over raw Web Storage",
        },
        messages: {
            preferStorage: "Use VueUse '{{helper}}()' instead of accessing {{native}} directly.",
        },
        schema: [],
    },
    create(context) {
        return {
            MemberExpression(node) {
                if (!isInEffectScope(context, node)) {
                    return;
                }

                if (node.object.type === "Identifier" && MEMBER_ACCESS[node.object.name]) {
                    context.report({
                        node: node.object,
                        messageId: "preferStorage",
                        data: { helper: MEMBER_ACCESS[node.object.name], native: node.object.name },
                    });
                    return;
                }

                if (!node.computed && node.property.type === "Identifier" && MEMBER_ACCESS[node.property.name]) {
                    context.report({
                        node: node.property,
                        messageId: "preferStorage",
                        data: { helper: MEMBER_ACCESS[node.property.name], native: node.property.name },
                    });
                }
            },
        };
    },
};
