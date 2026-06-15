// radash-* rules: prefer radash helpers over hand-rolled equivalents.

// radash-prefer-is: prefer isString/isNumber/... over typeof comparisons
if (typeof value === "string") {
    // ...
}

// radash-prefer-call: prefer parallel/all over Promise.all
const results = await Promise.all(tasks);

// radash-prefer-clone: prefer clone() over JSON round-tripping
const copy = JSON.parse(JSON.stringify(source));

// radash-prefer-unique: prefer unique() over [...new Set()]
const deduped = [...new Set(items)];

// radash-prefer-sum: prefer sum() over reduce(a + b)
const total = values.reduce((a, b) => a + b, 0);

// radash-prefer-sleep: prefer sleep() over a setTimeout promise
await new Promise((resolve) => setTimeout(resolve, 1000));
