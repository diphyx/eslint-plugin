// Intentionally-bad store fixtures. Each createStore below is crafted to trip
// exactly one @diphyx/store-* rule so `pnpm run lint:warnings` shows them firing.
// Unique variable names avoid redeclaration and cross-rule noise.

// store-require-name: missing `name`
const requireNameStore = createStore({
    model() {
        return {};
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-require-model: missing `model`
const requireModelStore = createStore({
    name: "requireModel",
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-require-view: missing `view`
const requireViewStore = createStore({
    name: "requireView",
    model() {
        return {};
    },
    action() {
        return {};
    },
});

// store-require-action: missing `action`
const requireActionStore = createStore({
    name: "requireAction",
    model() {
        return {};
    },
    view() {
        return {};
    },
});

// store-section-function: `model` is a plain object, not a factory function
const sectionFunctionStore = createStore({
    name: "sectionFunction",
    model: { list: null },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-section-method: `model` is an arrow function, not method shorthand
const sectionMethodStore = createStore({
    name: "sectionMethod",
    model: ({ many }) => {
        const list = many(accountShape);

        return { list };
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-section-return-shorthand: returns an inline value instead of a shorthand
const returnShorthandStore = createStore({
    name: "returnShorthand",
    model({ many }) {
        return { list: many(accountShape) };
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-config-order: `model` declared before `name`
const configOrderStore = createStore({
    model() {
        return {};
    },
    name: "configOrder",
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-no-unknown-key: `getters` is not a recognized section
const noUnknownKeyStore = createStore({
    name: "noUnknownKey",
    model() {
        return {};
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
    getters: {},
});

// store-suffix: variable name lacks the `Store` suffix
const account = createStore({
    name: "account",
    model() {
        return {};
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-name-match: `name` does not match the variable (userStore → "user")
const userStore = createStore({
    name: "account",
    model() {
        return {};
    },
    view() {
        return {};
    },
    action() {
        return {};
    },
});

// store-shape-suffix: shape() result lacks the `Shape` suffix
const collection = shape(collectionSchema);

// store-mode-enum: `mode` is a string literal instead of a ModelMode enum
factory.commit({ model: users, mode: "set" });
