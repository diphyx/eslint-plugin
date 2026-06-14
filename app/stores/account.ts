export const accountShape = shape(accountSchema);

export const accountStore = createStore({
    name: "account",
    model({ many }) {
        const list = many(accountShape);

        return { list };
    },
    view({ from }) {
        const list = from("list");

        return { list };
    },
    action({ api }) {
        const get = api.get({ url: "/x" }, { model: "list", mode: ModelManyMode.SET });

        return { get };
    },
});
