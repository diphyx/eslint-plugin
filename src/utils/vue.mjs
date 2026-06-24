export function isVueFile(context) {
    return context.filename.endsWith(".vue");
}

const EFFECT_SCOPE_PATTERN = /^use[A-Z]/;

// Calls whose callback runs later, detached from the synchronous scope.
const SCHEDULING_CALLS = new Set([
    "setTimeout",
    "setInterval",
    "requestAnimationFrame",
    "queueMicrotask",
    "setImmediate",
]);
const DEFERRED_METHODS = new Set(["addEventListener", "then", "catch", "finally"]);
const EVENT_HANDLER_PROPERTY = /^on[a-z]/;

function isFunctionNode(node) {
    return (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
    );
}

// A function that only runs after the synchronous composable/setup body has
// finished: an assigned event handler (`socket.onopen = () => …`), a callback to
// a scheduler/listener (`setInterval`/`addEventListener`/…), or a promise
// continuation (`.then`/`.catch`/`.finally`). No effect scope is active there, so
// VueUse's scope-bound cleanup can't register.
function isDetachedCallback(fn) {
    const parent = fn.parent;
    if (!parent) {
        return false;
    }

    if (
        parent.type === "AssignmentExpression" &&
        parent.right === fn &&
        parent.left.type === "MemberExpression" &&
        !parent.left.computed &&
        parent.left.property.type === "Identifier" &&
        EVENT_HANDLER_PROPERTY.test(parent.left.property.name)
    ) {
        return true;
    }

    if (parent.type === "CallExpression" && parent.arguments.includes(fn)) {
        const callee = parent.callee;

        if (callee.type === "Identifier" && SCHEDULING_CALLS.has(callee.name)) {
            return true;
        }

        if (
            callee.type === "MemberExpression" &&
            !callee.computed &&
            callee.property.type === "Identifier" &&
            DEFERRED_METHODS.has(callee.property.name)
        ) {
            return true;
        }
    }

    return false;
}

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
    const vue = isVueFile(context);

    for (let current = node.parent; current; current = current.parent) {
        if (!isFunctionNode(current)) {
            continue;
        }

        // Crossing a detached callback means the node runs after the scope has
        // closed, so it is not in effect scope regardless of any enclosing
        // composable/setup.
        if (isDetachedCallback(current)) {
            return false;
        }

        const name = functionName(current);
        if (name && (name === "setup" || EFFECT_SCOPE_PATTERN.test(name))) {
            return true;
        }
    }

    // A `.vue` `<script setup>` is itself the setup scope, so a node that reached
    // the top without crossing a boundary is in scope; a plain module is not.
    return vue;
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
