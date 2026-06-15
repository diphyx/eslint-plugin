import { isInEffectScope } from "../utils/vue.mjs";

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse useClipboard over navigator.clipboard",
        },
        messages: {
            preferClipboard: "Use VueUse 'useClipboard()' instead of navigator.clipboard.",
        },
        schema: [],
    },
    create(context) {
        return {
            MemberExpression(node) {
                if (!isInEffectScope(context, node)) {
                    return;
                }

                if (
                    !node.computed &&
                    node.object.type === "Identifier" &&
                    node.object.name === "navigator" &&
                    node.property.type === "Identifier" &&
                    node.property.name === "clipboard"
                ) {
                    context.report({ node, messageId: "preferClipboard" });
                }
            },
        };
    },
};
