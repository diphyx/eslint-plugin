import { createDirectiveWrapperRule } from "../utils/vue.mjs";

export default createDirectiveWrapperRule({
    directives: ["for"],
    label: "v-for",
});
