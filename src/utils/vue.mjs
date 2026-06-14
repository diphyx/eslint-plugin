// Helpers for rules that operate on Vue SFCs (*.vue).

export function isVueFile(context) {
    return context.filename.endsWith(".vue");
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
