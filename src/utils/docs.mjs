const DOCS_BASE = "https://github.com/diphyx/eslint-plugin/blob/main/docs/rules";

export function docsUrl(name) {
    return `${DOCS_BASE}/${name}.md`;
}
