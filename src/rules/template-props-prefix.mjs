import { isVueFile } from "../utils/vue.mjs";

function collectPropNames(node, names) {
    const objectArgument = node.arguments.find((argument) => argument.type === "ObjectExpression");
    if (objectArgument) {
        for (const property of objectArgument.properties) {
            if (property.type === "Property" && !property.computed) {
                if (property.key.type === "Identifier") {
                    names.add(property.key.name);
                } else if (property.key.type === "Literal" && typeof property.key.value === "string") {
                    names.add(property.key.value);
                }
            }
        }

        return;
    }

    const arrayArgument = node.arguments.find((argument) => argument.type === "ArrayExpression");
    if (arrayArgument) {
        for (const element of arrayArgument.elements) {
            if (element && element.type === "Literal" && typeof element.value === "string") {
                names.add(element.value);
            }
        }

        return;
    }

    const typeArguments = node.typeArguments || node.typeParameters;
    const typeLiteral = typeArguments?.params?.[0];
    if (typeLiteral && typeLiteral.type === "TSTypeLiteral") {
        for (const member of typeLiteral.members) {
            if (member.type === "TSPropertySignature" && !member.computed && member.key.type === "Identifier") {
                names.add(member.key.name);
            }
        }
    }
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "props must be read via the props object in the template, not the bare binding",
        },
        messages: {
            usePrefix: "Access prop '{{name}}' via 'props.{{name}}' in the template, not the bare binding.",
        },
        schema: [],
    },
    create(context) {
        if (!isVueFile(context)) {
            return {};
        }

        const services = context.sourceCode.parserServices;
        if (!services || !services.defineTemplateBodyVisitor) {
            return {};
        }

        const propNames = new Set();

        return services.defineTemplateBodyVisitor(
            {
                VExpressionContainer(node) {
                    for (const reference of node.references) {
                        if (reference.variable) {
                            continue;
                        }

                        if (propNames.has(reference.id.name)) {
                            context.report({
                                node: reference.id,
                                messageId: "usePrefix",
                                data: {
                                    name: reference.id.name,
                                },
                            });
                        }
                    }
                },
            },
            {
                CallExpression(node) {
                    if (node.callee.type === "Identifier" && node.callee.name === "defineProps") {
                        collectPropNames(node, propNames);
                    }
                },
            },
        );
    },
};
