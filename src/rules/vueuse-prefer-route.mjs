// Prefer VueUse route composables (useRouteQuery / useRouteParams / useRouteHash)
// over reading query / params / hash from a raw useRoute() result. Other route
// properties (name, path, meta, ...) have no VueUse equivalent and are left alone.

import { isInEffectScope } from "../utils/vue.mjs";

// route property → VueUse composable
const ROUTE_PROPERTIES = {
    query: "useRouteQuery",
    params: "useRouteParams",
    hash: "useRouteHash",
};

function isUseRouteCall(node) {
    return node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "useRoute";
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description: "prefer VueUse route composables over raw useRoute() query/params/hash access",
        },
        messages: {
            preferRoute: "Use VueUse '{{helper}}()' instead of reading '{{property}}' from useRoute().",
        },
        schema: [],
    },
    create(context) {
        // Names bound to a useRoute() result, e.g. `const route = useRoute()`.
        const routeBindings = new Set();

        return {
            VariableDeclarator(node) {
                if (node.init && isUseRouteCall(node.init) && node.id.type === "Identifier") {
                    routeBindings.add(node.id.name);
                }
            },
            MemberExpression(node) {
                if (node.computed || node.property.type !== "Identifier") {
                    return;
                }

                if (!isInEffectScope(context, node)) {
                    return;
                }

                const helper = ROUTE_PROPERTIES[node.property.name];
                if (!helper) {
                    return;
                }

                // useRoute().query  |  const route = useRoute(); route.query
                const object = node.object;
                const fromRoute =
                    isUseRouteCall(object) || (object.type === "Identifier" && routeBindings.has(object.name));
                if (fromRoute) {
                    context.report({
                        node,
                        messageId: "preferRoute",
                        data: {
                            helper,
                            property: node.property.name,
                        },
                    });
                }
            },
        };
    },
};
