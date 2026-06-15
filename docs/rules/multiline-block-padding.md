# multiline-block-padding

> require a blank line between multi-line sibling statements

## Rule Details

Requires a blank line between two adjacent sibling statements when **either** spans more than one line; runs of single-line statements may stay tight. Applies to `.ts` files and `.vue` `<script setup>`, in every statement block.

Two exceptions: a comment between the statements already separates them, and a statement that consumes a variable from a **single-line** declaration right above it stays attached (a multi-line declaration still earns its blank line).

### ❌ Incorrect

```ts
const count = ref(0);
const label = ref("counter");
const increment = () => {
    count.value++;
};
const other = "other";
```

```ts
// The declaration is multi-line, so it still needs a blank line before the guard.
const callError = await call({
    method: "POST",
    body: { force: payload.force },
});
if (callError) {
    throw callError;
}
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

```ts
// A block that uses the value declared right above it stays tight.
const user = await fetchUser(id);
if (user.isActive) {
    notify(user);
}
```
