// Regression guards for false positives fixed in three rules. None of the lines
// below may warn — the harness `valid` check enforces zero problems here.
export const useFalsePositiveGuards = (value: unknown) => {
    // radash-prefer-is: inherited Object.prototype names ("constructor",
    // "toString", …) are not radash type strings, so these typeof comparisons
    // must not be flagged.
    const isConstructor = typeof value === "constructor";
    const isToString = typeof value === "toString";

    // radash-prefer-sum: a reduce whose operands are not the distinct
    // accumulator/element pair is not a sum over the array.
    const repeated = [1, 2].reduce((accumulator, element) => {
        return accumulator + accumulator;
    }, 0);

    // vueuse-prefer-storage: a `localStorage` property on an unrelated object is
    // not Web Storage and must not be flagged.
    const adapter = { localStorage: true } as Record<string, unknown>;
    const flag = adapter.localStorage;

    return { isConstructor, isToString, repeated, flag };
};
