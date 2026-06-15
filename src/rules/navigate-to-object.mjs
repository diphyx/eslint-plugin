export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "navigateTo must be called with a route object, not a route string",
        },
        messages: {
            useObject: 'Pass a route object to navigateTo (e.g. navigateTo({ name: "..." })), not a string.',
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== "Identifier" || node.callee.name !== "navigateTo") {
                    return;
                }

                const [first] = node.arguments;
                if (!first) {
                    return;
                }

                const isStringLiteral = first.type === "Literal" && typeof first.value === "string";
                if (isStringLiteral || first.type === "TemplateLiteral") {
                    context.report({ node: first, messageId: "useObject" });
                }
            },
        };
    },
};
