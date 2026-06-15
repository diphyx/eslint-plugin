import { defineTemplateRule } from "../utils/vue.mjs";

const TEXT_ELEMENTS = new Set([
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "li",
    "td",
    "th",
    "dt",
    "dd",
    "label",
    "legend",
    "caption",
    "figcaption",
    "summary",
    "em",
    "strong",
    "b",
    "i",
    "u",
    "s",
    "small",
    "mark",
    "q",
    "cite",
    "dfn",
    "abbr",
    "time",
    "code",
    "pre",
    "blockquote",
]);

const TEXT_PATTERN = /^[A-Za-z][A-Za-z .,]*$/;

function onOwnRow(text, index) {
    let i = index - 1;
    while (i >= 0 && (text[i] === " " || text[i] === "\t")) {
        i--;
    }

    return i >= 0 && (text[i] === "\n" || text[i] === "\r");
}

export default defineTemplateRule(
    {
        type: "suggestion",
        docs: {
            description: "text content should be wrapped in an HTML tag",
        },
        messages: {
            wrapText: "Text content '{{text}}' should be wrapped in an HTML tag like <span>.",
        },
        schema: [],
    },
    (context) => {
        const text = context.sourceCode.getText();

        return {
            VText(node) {
                const value = node.value.trim();
                if (value.length <= 1) {
                    return;
                }

                if (!TEXT_PATTERN.test(value)) {
                    return;
                }

                const isWrapped = node.parent.type === "VElement" && TEXT_ELEMENTS.has(node.parent.name);
                if (isWrapped) {
                    return;
                }

                const leading = node.value.length - node.value.trimStart().length;
                if (!onOwnRow(text, node.range[0] + leading)) {
                    return;
                }

                const label = value.length > 40 ? value.substring(0, 40) + "..." : value;
                context.report({
                    node,
                    messageId: "wrapText",
                    data: { text: label },
                });
            },
            VExpressionContainer(node) {
                if (node.parent.type !== "VElement" || TEXT_ELEMENTS.has(node.parent.name)) {
                    return;
                }

                if (!onOwnRow(text, node.range[0])) {
                    return;
                }

                const raw = context.sourceCode.getText(node).trim();
                const label = raw.length > 40 ? raw.substring(0, 40) + "..." : raw;
                context.report({
                    node,
                    messageId: "wrapText",
                    data: { text: label },
                });
            },
        };
    },
);
