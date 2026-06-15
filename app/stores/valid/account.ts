// Valid counterpart to stores/invalid/store.ts: a well-formed store + shape that
// every store-* rule accepts, so `pnpm run lint` reports zero warnings here.
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
