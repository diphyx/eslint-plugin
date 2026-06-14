# template-text

> text content should be wrapped in an HTML tag

## Rule Details

This rule flags bare text content (more than one character, matching a plain word/sentence pattern) that sits directly inside an element which is not a recognized text element such as `<span>`, `<p>`, or `<h1>`. Wrapping text in a semantic inline tag keeps markup consistent and stylable.

### ❌ Incorrect

```vue
<template>
    <div>Hello world</div>
</template>
```

### ✅ Correct

```vue
<template>
    <div><span>Hello world</span></div>
</template>
```
