function isMultiline(node) {
    return node.loc.start.line !== node.loc.end.line;
}

function dependsOnPrevious(sourceCode, previous, current) {
    if (previous.type !== "VariableDeclaration" || isMultiline(previous)) {
        return false;
    }

    const [start, end] = current.range;

    for (const variable of sourceCode.getDeclaredVariables(previous)) {
        for (const reference of variable.references) {
            const [refStart] = reference.identifier.range;
            if (refStart >= start && refStart < end) {
                return true;
            }
        }
    }

    return false;
}

export default {
    meta: {
        type: "layout",
        docs: {
            description: "require a blank line between multi-line sibling statements",
        },
        messages: {
            expectedBlankLine: "Multi-line statements should be separated from their siblings by a blank line.",
        },
        schema: [],
    },
    create(context) {
        const sourceCode = context.sourceCode;

        function check(statements) {
            for (let i = 1; i < statements.length; i++) {
                const previous = statements[i - 1];
                const current = statements[i];

                if (sourceCode.getCommentsBefore(current).length > 0) {
                    continue;
                }

                if (!isMultiline(previous) && !isMultiline(current)) {
                    continue;
                }

                if (dependsOnPrevious(sourceCode, previous, current)) {
                    continue;
                }

                const linesBetween = current.loc.start.line - previous.loc.end.line;
                if (linesBetween >= 2) {
                    continue;
                }

                context.report({
                    node: current,
                    messageId: "expectedBlankLine",
                });
            }
        }

        return {
            Program(node) {
                check(node.body);
            },
            BlockStatement(node) {
                check(node.body);
            },
            StaticBlock(node) {
                check(node.body);
            },
        };
    },
};
