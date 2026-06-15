const ALLOWED_PATTERN = /^use[A-Z]/;

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "exported composable functions must follow useXxx naming pattern",
        },
        messages: {
            invalidName: "Exported composable function '{{name}}' should follow useXxx naming pattern.",
        },
        schema: [],
    },
    create(context) {
        function check(idNode) {
            const name = idNode?.name;
            if (!name) {
                return;
            }

            if (!ALLOWED_PATTERN.test(name)) {
                context.report({
                    node: idNode,
                    messageId: "invalidName",
                    data: {
                        name,
                    },
                });
            }
        }

        return {
            ExportNamedDeclaration(node) {
                const declaration = node.declaration;
                if (!declaration) {
                    return;
                }

                if (declaration.type === "FunctionDeclaration") {
                    check(declaration.id);

                    return;
                }

                if (declaration.type === "VariableDeclaration") {
                    for (const declarator of declaration.declarations) {
                        const init = declarator.init;
                        if (init && (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression")) {
                            check(declarator.id);
                        }
                    }
                }
            },
        };
    },
};
