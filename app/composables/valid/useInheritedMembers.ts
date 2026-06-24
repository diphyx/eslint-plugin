// Regression guard for issue #3: inherited Object.prototype members
// (toString, toLocaleString, valueOf, hasOwnProperty, …) must NOT be flagged by
// the vueuse-prefer-* rules. They previously produced false positives because
// the rules looked member names up in a prototype-bearing object literal, so
// `LOOKUP["toString"]` resolved to Object.prototype.toString (truthy). The
// lookup tables are now prototype-less, so this composable must stay clean.
export const useInheritedMembers = () => {
    const amount = 1234;

    // member calls — previously flagged by vueuse-prefer-member-call
    const label = amount.toLocaleString("en-US");
    const text = amount.toString();
    const primitive = amount.valueOf();

    // member access without a call — previously flagged by vueuse-prefer-storage
    const stringify = amount.toString;
    const owns = Object.prototype.hasOwnProperty.call({}, "x");

    return { label, text, primitive, stringify, owns };
};
