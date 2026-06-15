import { createDirectiveWrapperRule } from "../utils/vue.mjs";

export default createDirectiveWrapperRule({
    directives: ["else-if", "else"],
    label: "v-else / v-else-if",
});
