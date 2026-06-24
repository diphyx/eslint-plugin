import { isVueFile } from "../utils/vue.mjs";

// A TSTypeLiteral keeps its members under `.members`; a TSInterfaceBody under
// `.body`. Take the array directly so both shapes are handled.
function collectSignatureNames(members, names) {
    for (const member of members) {
        if (member.type === "TSPropertySignature" && !member.computed && member.key.type === "Identifier") {
            names.add(member.key.name);
        }
    }
}

// Map each top-level `interface X {…}` / `type X = {…}` to its property names, so
// `defineProps<X>()` (a named type reference) can be resolved — not just the
// inline `defineProps<{…}>()` literal form.
function collectTypeDeclarations(program) {
    const declarations = new Map();

    for (const statement of program.body) {
        const node =
            statement.type === "ExportNamedDeclaration" && statement.declaration ? statement.declaration : statement;

        if (node.type === "TSInterfaceDeclaration" && node.id.type === "Identifier") {
            const names = new Set();
            collectSignatureNames(node.body.body, names);
            declarations.set(node.id.name, names);
        } else if (
            node.type === "TSTypeAliasDeclaration" &&
            node.id.type === "Identifier" &&
            node.typeAnnotation.type === "TSTypeLiteral"
        ) {
            const names = new Set();
            collectSignatureNames(node.typeAnnotation.members, names);
            declarations.set(node.id.name, names);
        }
    }

    return declarations;
}

function collectPropNames(node, names, typeDeclarations) {
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
    const typeArgument = typeArguments?.params?.[0];
    if (!typeArgument) {
        return;
    }

    if (typeArgument.type === "TSTypeLiteral") {
        collectSignatureNames(typeArgument.members, names);
    } else if (typeArgument.type === "TSTypeReference" && typeArgument.typeName.type === "Identifier") {
        const resolved = typeDeclarations.get(typeArgument.typeName.name);
        if (resolved) {
            for (const name of resolved) {
                names.add(name);
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
        const typeDeclarations = collectTypeDeclarations(context.sourceCode.ast);

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
                        collectPropNames(node, propNames, typeDeclarations);
                    }
                },
            },
        );
    },
};
