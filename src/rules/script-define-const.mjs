import { isVueFile } from "../utils/vue.mjs";

const MACRO_NAMES = {
    defineProps: "props",
    defineModel: "model",
    defineEmits: "emit",
    defineSlots: "slots",
};

function expectedName(node) {
    if (node.callee.name === "defineModel") {
        const first = node.arguments[0];
        if (first && first.type === "Literal" && typeof first.value === "string") {
            return first.value;
        }
    }

    return MACRO_NAMES[node.callee.name];
}

function findDeclarator(node) {
    let current = node;
    let parent = current.parent;

    while (parent && parent.type === "CallExpression" && parent.arguments.includes(current)) {
        current = parent;
        parent = current.parent;
    }

    if (parent && parent.type === "VariableDeclarator" && parent.init === current) {
        return parent;
    }

    return null;
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "define* macros must be assigned to a const with the conventional name",
        },
        messages: {
            requireConst:
                "'{{macro}}' must be assigned to a const named '{{name}}', e.g. const {{name}} = {{macro}}(...).",
            nameMismatch: "'{{macro}}' should be assigned to a const named '{{name}}', not '{{actual}}'.",
        },
        schema: [],
    },
    create(context) {
        if (!isVueFile(context)) {
            return {};
        }

        return {
            CallExpression(node) {
                if (node.callee.type !== "Identifier" || !(node.callee.name in MACRO_NAMES)) {
                    return;
                }

                const macro = node.callee.name;
                const name = expectedName(node);
                const declarator = findDeclarator(node);

                if (!declarator || declarator.parent.kind !== "const" || declarator.id.type !== "Identifier") {
                    context.report({
                        node: node.callee,
                        messageId: "requireConst",
                        data: {
                            macro,
                            name,
                        },
                    });

                    return;
                }

                if (declarator.id.name !== name) {
                    context.report({
                        node: declarator.id,
                        messageId: "nameMismatch",
                        data: {
                            macro,
                            name,
                            actual: declarator.id.name,
                        },
                    });
                }
            },
        };
    },
};
