// Helpers for rules that operate on Vue SFCs (*.vue).

export function isVueFile(context) {
    return context.filename.endsWith(".vue");
}

// Functions that establish a Vue effect scope: a use* composable or a setup().
const EFFECT_SCOPE_PATTERN = /^use[A-Z]/;

// Name a function node is bound to — handles declarations, variable-assigned
// arrows/expressions, and object/class methods.
function functionName(fn) {
    if (fn.id && fn.id.name) {
        return fn.id.name;
    }

    const parent = fn.parent;
    if (!parent) {
        return null;
    }

    // const useX = () => {} | const useX = function () {}
    if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
        return parent.id.name;
    }

    // { setup() {} } | { setup: () => {} } | class { setup() {} }
    if (
        (parent.type === "Property" || parent.type === "MethodDefinition") &&
        !parent.computed &&
        parent.key &&
        parent.key.type === "Identifier"
    ) {
        return parent.key.name;
    }

    return null;
}

// True when `node` sits where a Vue effect scope is active — a .vue
// <script setup>, a component setup(), or a use* composable. Outside such a
// scope VueUse's onScopeDispose-based auto-cleanup never runs, so the
// vueuse-prefer-* suggestions don't apply (plain utility modules/classes).
export function isInEffectScope(context, node) {
    if (isVueFile(context)) {
        return true;
    }

    for (let current = node.parent; current; current = current.parent) {
        if (
            current.type === "FunctionDeclaration" ||
            current.type === "FunctionExpression" ||
            current.type === "ArrowFunctionExpression"
        ) {
            const name = functionName(current);
            if (name && (name === "setup" || EFFECT_SCOPE_PATTERN.test(name))) {
                return true;
            }
        }
    }

    return false;
}

// Wraps a template-body visitor with the shared .vue + parserServices guards.
export function defineTemplateRule(meta, createVisitor) {
    return {
        meta,
        create(context) {
            if (!isVueFile(context)) {
                return {};
            }

            const services = context.sourceCode.parserServices;
            if (!services || !services.defineTemplateBodyVisitor) {
                return {};
            }

            return services.defineTemplateBodyVisitor(createVisitor(context));
        },
    };
}

// Factory for "directive must live on a <template> wrapper" rules.
export function createDirectiveWrapperRule({ directives, label }) {
    const targets = new Set(directives);

    return defineTemplateRule(
        {
            type: "suggestion",
            docs: {
                description: `${label} must be used on a <template> wrapper`,
            },
            messages: {
                requireWrapper: "v-{{directive}} on <{{element}}> should be wrapped with <template>.",
            },
            schema: [],
        },
        (context) => ({
            VElement(node) {
                if (node.name === "template") {
                    return;
                }

                const directive = node.startTag.attributes.find((attribute) => {
                    if (!attribute.directive || !attribute.key || !attribute.key.name) {
                        return false;
                    }

                    return targets.has(attribute.key.name.name);
                });

                if (!directive) {
                    return;
                }

                context.report({
                    node: directive,
                    messageId: "requireWrapper",
                    data: {
                        directive: directive.key.name.name,
                        element: node.name,
                    },
                });
            },
        }),
    );
}
