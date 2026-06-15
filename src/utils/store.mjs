export const SECTION_ORDER = ["name", "model", "view", "action", "compose", "lazy"];

export const ALLOWED_KEYS = new Set(SECTION_ORDER);

export const FUNCTION_SECTIONS = new Set(["model", "view", "action", "compose"]);

export function isCreateStoreCall(node) {
    return node.callee && node.callee.type === "Identifier" && node.callee.name === "createStore";
}

export function getCreateStoreConfig(node) {
    return node.arguments.find((argument) => argument.type === "ObjectExpression") || null;
}

export function getKeyedProperties(objectExpression) {
    return objectExpression.properties.filter(
        (property) => property.type === "Property" && property.key.type === "Identifier",
    );
}

export function findProperty(objectExpression, key) {
    return getKeyedProperties(objectExpression).find((property) => property.key.name === key) || null;
}

export function requireKey(key, message) {
    return {
        meta: {
            type: "problem",
            docs: {
                description: `createStore config must include '${key}'`,
            },
            messages: {
                missing: message,
            },
            schema: [],
        },
        create(context) {
            return {
                CallExpression(node) {
                    if (!isCreateStoreCall(node)) {
                        return;
                    }

                    const config = getCreateStoreConfig(node);
                    if (!config) {
                        return;
                    }

                    if (!findProperty(config, key)) {
                        context.report({
                            node,
                            messageId: "missing",
                        });
                    }
                },
            };
        },
    };
}
