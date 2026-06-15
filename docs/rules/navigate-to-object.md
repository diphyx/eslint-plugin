# navigate-to-object

> navigateTo must be called with a route object, not a route string

## Rule Details

This rule flags a `navigateTo(...)` call whose first argument is a string literal
or template literal, requiring a route object (`{ name: ... }` or `{ path: ... }`)
instead. Route objects are explicit about the target and carry query/params
without manual string building.

External redirects that genuinely need a URL string
(`navigateTo(url, { external: true })`) are the exception — disable the rule on
that line.

### ❌ Incorrect

```ts
await navigateTo("/dashboard");
```

### ✅ Correct

```ts
await navigateTo({ name: "dashboard" });
```
