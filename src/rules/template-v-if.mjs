import { createDirectiveWrapperRule } from "../utils/vue.mjs";

export default createDirectiveWrapperRule({
    directives: ["if"],
    label: "v-if",
});
