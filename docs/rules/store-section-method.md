# store-section-method

> createStore sections must use method shorthand, not arrow functions

## Rule Details

This rule flags a `model` / `view` / `action` / `compose` section written as an arrow function (or a plain function expression). Sections use method shorthand so the factory destructure reads cleanly. Whether a section is a function at all is handled by `store-section-function`.

### ❌ Incorrect

```ts
export const accountStore = createStore({
    name: "account",
    model: ({ many }) => {
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
```

### ✅ Correct

```ts
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
```
