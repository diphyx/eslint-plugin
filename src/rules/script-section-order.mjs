import { getCallName } from "../utils/ast.mjs";
import { isVueFile } from "../utils/vue.mjs";

const ORDER = [
    "import",
    "props",
    "model",
    "emit",
    "composable",
    "state",
    "computed",
    "watch",
    "method",
    "lifecycle",
    "expose",
];

const WATCH_CALLS = new Set(["watch", "watchEffect", "watchDebounced"]);

const LIFECYCLE_CALLS = new Set(["onMounted", "onUnmounted", "onBeforeMount", "onBeforeUnmount", "onUpdated"]);

const STATE_CALLS = new Set(["ref", "reactive", "shallowRef", "shallowReactive"]);

const MACRO_SECTIONS = {
    defineProps: "props",
    defineModel: "model",
    defineEmits: "emit",
    defineExpose: "expose",
};

function isSetupScript(node) {
    return (
        node.type === "VElement" &&
        node.name === "script" &&
        node.startTag.attributes.some(
            (attribute) => !attribute.directive && attribute.key && attribute.key.name === "setup",
        )
    );
}

function setupScriptRange(context) {
    const services = context.sourceCode.parserServices;
    if (!services || typeof services.getDocumentFragment !== "function") {
        return null;
    }

    const fragment = services.getDocumentFragment();
    if (!fragment) {
        return null;
    }

    const setupElement = fragment.children.find(isSetupScript);
    return setupElement ? setupElement.range : null;
}

// Collect identifier names used in *reference* position within a subtree —
// skipping non-computed member properties (`amount.value` → `amount`, not
// `value`) and non-computed object/property keys (`{ duration: 500 }`).
function collectReferences(node, names) {
    if (!node || typeof node.type !== "string") {
        return;
    }

    if (node.type === "Identifier") {
        names.add(node.name);
        return;
    }

    for (const key of Object.keys(node)) {
        if (key === "parent") {
            continue;
        }

        if (node.type === "MemberExpression" && key === "property" && !node.computed) {
            continue;
        }

        if (node.type === "Property" && key === "key" && !node.computed) {
            continue;
        }

        const value = node[key];
        if (Array.isArray(value)) {
            for (const child of value) {
                collectReferences(child, names);
            }
        } else if (value && typeof value.type === "string") {
            collectReferences(value, names);
        }
    }
}

// Collect the binding names a declarator `id` introduces, including
// destructuring (`const { a, b: c } = …` → `a`, `c`; `const [x] = …` → `x`).
function collectBindings(node, names) {
    if (!node || typeof node.type !== "string") {
        return;
    }

    if (node.type === "Identifier") {
        names.add(node.name);
        return;
    }

    for (const key of Object.keys(node)) {
        if (key === "parent") {
            continue;
        }

        if (node.type === "Property" && key === "key" && !node.computed) {
            continue;
        }

        const value = node[key];
        if (Array.isArray(value)) {
            for (const child of value) {
                collectBindings(child, names);
            }
        } else if (value && typeof value.type === "string") {
            collectBindings(value, names);
        }
    }
}

function referencedNames(node) {
    const names = new Set();

    if (node.type === "VariableDeclaration") {
        for (const declarator of node.declarations) {
            if (declarator.init) {
                collectReferences(declarator.init, names);
            }
        }
    } else if (node.type === "ExpressionStatement") {
        collectReferences(node.expression, names);
    }

    return names;
}

function classify(node) {
    if (node.type === "ImportDeclaration") {
        return "import";
    }

    if (node.type === "ExpressionStatement") {
        const callName = getCallName(node.expression);

        if (callName && MACRO_SECTIONS[callName]) {
            return MACRO_SECTIONS[callName];
        }

        if (callName && WATCH_CALLS.has(callName)) {
            return "watch";
        }

        if (callName && LIFECYCLE_CALLS.has(callName)) {
            return "lifecycle";
        }

        return null;
    }

    if (node.type === "VariableDeclaration") {
        for (const declarator of node.declarations) {
            if (!declarator.init) {
                continue;
            }

            if (declarator.init.type === "ArrowFunctionExpression" || declarator.init.type === "FunctionExpression") {
                return "method";
            }

            const callName = getCallName(declarator.init);
            if (!callName) {
                continue;
            }

            if (MACRO_SECTIONS[callName]) {
                return MACRO_SECTIONS[callName];
            }

            if (/^use[A-Z]/.test(callName)) {
                return "composable";
            }

            if (STATE_CALLS.has(callName) && declarator.init.arguments.length > 0) {
                return "state";
            }

            if (callName === "computed") {
                return "computed";
            }

            if (WATCH_CALLS.has(callName)) {
                return "watch";
            }

            if (LIFECYCLE_CALLS.has(callName)) {
                return "lifecycle";
            }
        }

        return null;
    }

    if (node.type === "FunctionDeclaration") {
        return "method";
    }

    return null;
}

export default {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "enforce script setup section order (import → props → model → emit → composable → state → computed → watch → method → lifecycle → expose)",
        },
        messages: {
            outOfOrder: "'{{current}}' section should come after '{{previous}}' section, not before.",
        },
        schema: [],
    },
    create(context) {
        if (!isVueFile(context)) {
            return {};
        }

        // With both a module `<script>` and a `<script setup>` block,
        // vue-eslint-parser emits every top-level statement from both blocks into
        // a single Program (module block first). Only the setup block has an
        // enforceable order, so confine the check to its range; statements from
        // the free-form module block must not seed the ordering state.
        const setupRange = setupScriptRange(context);

        // Tier index of each binding declared so far, so a node placed out of
        // order can be checked for a data dependency on an earlier later-tier
        // binding (see dependsOnLaterBinding).
        const bindingTiers = new Map();

        let lastSeenIndex = -1;
        let lastSeenCategory = null;

        // A node may have to sit below a higher-tier section when its initializer
        // reads an earlier binding from that section — e.g. a composable like
        // `useTransition(() => amount.value, …)` reads the computed `amount`
        // synchronously, so moving it above the computed would throw a TDZ
        // ReferenceError. Such forced placements must not be reported.
        function dependsOnLaterBinding(node, categoryIndex) {
            for (const name of referencedNames(node)) {
                const tier = bindingTiers.get(name);
                if (tier !== undefined && tier > categoryIndex) {
                    return true;
                }
            }

            return false;
        }

        function recordBindings(node, categoryIndex) {
            if (node.type !== "VariableDeclaration") {
                return;
            }

            const names = new Set();
            for (const declarator of node.declarations) {
                collectBindings(declarator.id, names);
            }

            for (const name of names) {
                bindingTiers.set(name, categoryIndex);
            }
        }

        return {
            "Program > *"(node) {
                if (setupRange && (node.range[0] < setupRange[0] || node.range[1] > setupRange[1])) {
                    return;
                }

                const category = classify(node);
                if (!category) {
                    return;
                }

                const categoryIndex = ORDER.indexOf(category);
                if (categoryIndex < lastSeenIndex && !dependsOnLaterBinding(node, categoryIndex)) {
                    context.report({
                        node,
                        messageId: "outOfOrder",
                        data: {
                            current: category,
                            previous: lastSeenCategory,
                        },
                    });
                } else if (categoryIndex > lastSeenIndex) {
                    lastSeenIndex = categoryIndex;
                    lastSeenCategory = category;
                }

                recordBindings(node, categoryIndex);
            },
        };
    },
};
