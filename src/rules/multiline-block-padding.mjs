// Require a blank line between sibling statements when either of them spans more
// than one line. Multi-line blocks (functions, multi-line objects, if/for/try
// blocks, multi-line declarations, ...) get visual breathing room from their
// neighbours, while runs of single-line statements may stay tight.
//
// This is not expressible with the built-in `padding-line-between-statements`,
// which keys off statement *type* rather than whether a statement is multi-line.

function isMultiline(node) {
    return node.loc.start.line !== node.loc.end.line;
}

// True when `current` references a variable that `previous` declares — the two
// statements own the same value (e.g. `const x = ...` directly followed by an
// `if (x !== undefined) { ... }`), so forcing a blank line between them would
// split a single logical unit.
function dependsOnPrevious(sourceCode, previous, current) {
    if (previous.type !== "VariableDeclaration") {
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

                // A comment in the gap already acts as a separator — leave it alone
                // rather than fight with the author's chosen comment placement.
                if (sourceCode.getCommentsBefore(current).length > 0) {
                    continue;
                }

                // Only multi-line statements earn the surrounding blank line.
                if (!isMultiline(previous) && !isMultiline(current)) {
                    continue;
                }

                // A statement that consumes the value declared right above it
                // belongs with that declaration — don't wedge a blank line in.
                if (dependsOnPrevious(sourceCode, previous, current)) {
                    continue;
                }

                // >= 2 means at least one fully blank line already sits between them.
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
