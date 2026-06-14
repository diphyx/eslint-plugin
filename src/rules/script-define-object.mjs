// Compiler macros must declare their shape with a runtime object argument, e.g.
// defineProps({ ... }), rather than the type-only generic form defineProps<{ ... }>().
// A type-only call has no runtime object, so it is reported; defineModel<T>({ ... })
// (a type annotation plus the object) is fine because the object shape is present.

import { isVueFile } from "../utils/vue.mjs";

const MACROS = new Set(["defineProps", "defineModel", "defineEmits", "defineExpose"]);

function hasObjectArgument(node) {
    return node.arguments.some((argument) => argument.type === "ObjectExpression");
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "define* macros must declare their shape with a runtime object, not the type-only form",
        },
        messages: {
            requireObject:
                "'{{macro}}' should declare its shape with a runtime object, e.g. {{macro}}({ ... }), not the type-only form.",
        },
        schema: [],
    },
    create(context) {
        if (!isVueFile(context)) {
            return {};
        }

        return {
            CallExpression(node) {
                if (node.callee.type !== "Identifier" || !MACROS.has(node.callee.name)) {
                    return;
                }

                if (!hasObjectArgument(node)) {
                    context.report({
                        node: node.callee,
                        messageId: "requireObject",
                        data: {
                            macro: node.callee.name,
                        },
                    });
                }
            },
        };
    },
};
