// Regression guard: getter sections and getter members in a createStore config
// must not be flagged by store-section-method / store-section-return-shorthand —
// a getter cannot be rewritten as method shorthand or a shorthand const, so the
// rules' suggestions would be impossible. This store must report zero warnings.
export const settingShape = shape(settingSchema);

export const settingStore = createStore({
    name: "setting",
    get model() {
        return ({ many }) => {
            const list = many(settingShape);

            return { list };
        };
    },
    view({ from }) {
        return {
            get list() {
                return from("list");
            },
        };
    },
    action({ api }) {
        const get = api.get({ url: "/x" }, { model: "list", mode: ModelManyMode.SET });

        return { get };
    },
});
