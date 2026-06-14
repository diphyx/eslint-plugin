// Builds the `meta.docs.url` for a rule from its name. Kept in one place so the
// URL scheme matches the docs/rules/<name>.md layout.

const DOCS_BASE = "https://github.com/diphyx/eslint-plugin/blob/main/docs/rules";

export function docsUrl(name) {
    return `${DOCS_BASE}/${name}.md`;
}
