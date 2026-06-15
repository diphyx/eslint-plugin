# template-text

> text content should be wrapped in an HTML tag

## Rule Details

Flags text content placed **on its own row** inside a non-text element (anything but `<span>`, `<p>`, `<h1>`, …); wrap it in a semantic inline tag. Inline content next to the tags (`<div>Hello world</div>`, `<UiBadge>{{ props.status }}</UiBadge>`) is left alone. Covers both static text and `{{ ... }}` interpolations; attribute bindings (`:title="x"`) and directives (`v-if="cond"`) are not text content.

### ❌ Incorrect

<!-- prettier-ignore -->
```vue
<template>
    <div>
        Hello world
    </div>

    <UiBadge :color="color">
        {{ props.status }}
    </UiBadge>
</template>
```

### ✅ Correct

```vue
<template>
    <div>Hello world</div>
    <UiBadge :color="color">{{ props.status }}</UiBadge>

    <div>
        <span>Hello world</span>
    </div>

    <UiBadge :color="color">
        <span>{{ props.status }}</span>
    </UiBadge>
</template>
```
