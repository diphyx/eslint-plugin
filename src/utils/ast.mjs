export function staticMemberName(node) {
    if (!node || node.type !== "MemberExpression" || node.computed) {
        return null;
    }

    if (node.object.type !== "Identifier" || node.property.type !== "Identifier") {
        return null;
    }

    return `${node.object.name}.${node.property.name}`;
}

export function getCallName(node) {
    if (node && node.type === "CallExpression" && node.callee.type === "Identifier") {
        return node.callee.name;
    }

    return null;
}
