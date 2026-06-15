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

        let lastSeenIndex = -1;
        let lastSeenCategory = null;

        return {
            "Program > *"(node) {
                const category = classify(node);
                if (!category) {
                    return;
                }

                const categoryIndex = ORDER.indexOf(category);
                if (categoryIndex < lastSeenIndex) {
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
            },
        };
    },
};
