// Exported composable functions must follow the useXxx naming pattern.
//
// The main composable is the module-level export; its returned methods
// (load/set/get/reset/start/stop) live inside it and are not linted here.

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

                // export function useXxx() {}
                if (declaration.type === "FunctionDeclaration") {
                    check(declaration.id);

                    return;
                }

                // export const useXxx = () => {} | function () {}
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
