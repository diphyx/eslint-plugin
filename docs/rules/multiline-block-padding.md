# multiline-block-padding

> require a blank line between multi-line sibling statements

## Rule Details

This rule keeps multi-line statements visually separated. Whenever two adjacent
sibling statements sit in the same block and **either** of them spans more than
one line, the rule requires at least one blank line between them. Runs of
single-line statements may stay tight.

It applies to script/TypeScript code — every `.ts` file and the `<script setup>`
of a `.vue` file — across all statement blocks (module top level as well as
function, `if`/`for`/`try`, and class static bodies).

A comment sitting between two statements already acts as a separator, so the
rule leaves those pairs alone.

This is intentionally not covered by the built-in
[`padding-line-between-statements`](https://eslint.org/docs/latest/rules/padding-line-between-statements),
which keys off statement _type_ rather than whether a statement is multi-line.

### ❌ Incorrect

```ts
const count = ref(0);
const label = ref("counter");
const increment = () => {
    count.value++;
};
const other = "other";
```

### ✅ Correct

```ts
const count = ref(0);
const label = ref("counter");

const increment = () => {
    count.value++;
};

const other = "other";
```
