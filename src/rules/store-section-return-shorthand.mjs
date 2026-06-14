// createStore sections must return a shorthand object of named consts —
// `const list = many(shape); return { list };` — rather than returning inline
// expressions like `return { list: many(shape) }`.

import { FUNCTION_SECTIONS, getCreateStoreConfig, getKeyedProperties, isCreateStoreCall } from "../utils/store.mjs";

// The object(s) a section function returns: an arrow concise body, or the
// top-level `return { ... }` statements of a block body (returns nested inside
// inner functions/branches are left alone).
function getReturnedObjects(fn) {
    const body = fn.body;

    if (body.type === "ObjectExpression") {
        return [body];
    }

    if (body.type !== "BlockStatement") {
        return [];
    }

    return body.body
        .filter((statement) => statement.type === "ReturnStatement")
        .map((statement) => statement.argument)
        .filter((argument) => argument && argument.type === "ObjectExpression");
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "createStore sections must return a shorthand object of named consts",
        },
        messages: {
            useShorthand:
                "Assign '{{key}}' to a const and return it as a shorthand property ({ {{key}} }) from '{{section}}'.",
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

                for (const property of getKeyedProperties(config)) {
                    if (!FUNCTION_SECTIONS.has(property.key.name)) {
                        continue;
                    }

                    const value = property.value;
                    if (value.type !== "ArrowFunctionExpression" && value.type !== "FunctionExpression") {
                        continue;
                    }

                    for (const returned of getReturnedObjects(value)) {
                        for (const member of returned.properties) {
                            if (member.type !== "Property" || member.computed || member.shorthand) {
                                continue;
                            }

                            context.report({
                                node: member,
                                messageId: "useShorthand",
                                data: {
                                    section: property.key.name,
                                    key: member.key.type === "Identifier" ? member.key.name : "value",
                                },
                            });
                        }
                    }
                }
            },
        };
    },
};
