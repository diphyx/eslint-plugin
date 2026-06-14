# vueuse-prefer-route

> prefer VueUse route composables over raw useRoute() query/params/hash access

## Rule Details

This rule flags reading `query`, `params`, or `hash` from a `useRoute()` result and suggests the reactive VueUse composables `useRouteQuery`, `useRouteParams`, and `useRouteHash` (from `@vueuse/router`), which stay in sync with the URL and support defaults and writes. Other route properties such as `name` or `path` have no VueUse equivalent and are left alone.

### ❌ Incorrect

```ts
const route = useRoute();

const page = route.query.page;
```

### ✅ Correct

```ts
const page = useRouteQuery("page");
```
