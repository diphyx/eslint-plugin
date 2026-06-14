# store-section-return-shorthand

> createStore sections must return a shorthand object of named consts

## Rule Details

This rule flags a section that returns inline expressions, e.g. `return { list: many(shape) }`. Assign each member to a named `const` first and return a shorthand object, so a section's public surface is easy to scan.

### ❌ Incorrect

```ts
export const accountStore = createStore({
    name: "account",
    model({ many }) {
        return { list: many(accountShape) };
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
