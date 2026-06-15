export function isVueFile(context) {
    return context.filename.endsWith(".vue");
}

const EFFECT_SCOPE_PATTERN = /^use[A-Z]/;

function functionName(fn) {
    if (fn.id && fn.id.name) {
        return fn.id.name;
    }

    const parent = fn.parent;
    if (!parent) {
        return null;
    }

    if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
        return parent.id.name;
    }

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
