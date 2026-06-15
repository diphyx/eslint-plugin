export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "store action 'mode' must use a ModelMode enum, not a string literal",
        },
        messages: {
            useEnum: "Use a ModelManyMode/ModelOneMode enum for 'mode' instead of the string literal '{{value}}'.",
        },
        schema: [],
    },
    create(context) {
        return {
            ObjectExpression(node) {
                const properties = node.properties.filter(
                    (property) => property.type === "Property" && property.key.type === "Identifier",
                );

                const modeProperty = properties.find((property) => property.key.name === "mode");
                const hasModel = properties.some((property) => property.key.name === "model");
                if (!modeProperty || !hasModel) {
                    return;
                }

                const value = modeProperty.value;
                if (value.type === "Literal" && typeof value.value === "string") {
                    context.report({
                        node: value,
                        messageId: "useEnum",
                        data: {
                            value: value.value,
                        },
                    });
                }
            },
        };
    },
};
