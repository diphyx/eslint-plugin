import { isInEffectScope } from "../utils/vue.mjs";

const MEMBER_ACCESS = Object.assign(Object.create(null), {
    localStorage: "useLocalStorage",
    sessionStorage: "useSessionStorage",
});

// Web Storage is only reached as a bare global or off the global object; a
// `localStorage`/`sessionStorage` property on any other object is unrelated.
const GLOBAL_HOSTS = new Set(["window", "globalThis", "self", "top", "parent", "frames"]);

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

                if (
                    !node.computed &&
                    node.property.type === "Identifier" &&
                    MEMBER_ACCESS[node.property.name] &&
                    node.object.type === "Identifier" &&
                    GLOBAL_HOSTS.has(node.object.name)
                ) {
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
