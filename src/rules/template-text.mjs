// Bare template text should be wrapped in an HTML tag.

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
    (context) => ({
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

            const label = value.length > 40 ? value.substring(0, 40) + "..." : value;
            context.report({
                node,
                messageId: "wrapText",
                data: { text: label },
            });
        },
    }),
);
