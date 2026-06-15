import { docsUrl } from "../utils/docs.mjs";

import templateVIf from "./template-v-if.mjs";
import templateVElse from "./template-v-else.mjs";
import templateVFor from "./template-v-for.mjs";
import templateText from "./template-text.mjs";
import templatePropsPrefix from "./template-props-prefix.mjs";

import scriptSectionOrder from "./script-section-order.mjs";
import scriptDefineObject from "./script-define-object.mjs";
import scriptDefineConst from "./script-define-const.mjs";

import storeRequireName from "./store-require-name.mjs";
import storeRequireModel from "./store-require-model.mjs";
import storeRequireView from "./store-require-view.mjs";
import storeRequireAction from "./store-require-action.mjs";
import storeSectionFunction from "./store-section-function.mjs";
import storeSectionMethod from "./store-section-method.mjs";
import storeSectionReturnShorthand from "./store-section-return-shorthand.mjs";
import storeConfigOrder from "./store-config-order.mjs";
import storeNoUnknownKey from "./store-no-unknown-key.mjs";
import storeSuffix from "./store-suffix.mjs";
import storeNameMatch from "./store-name-match.mjs";
import storeShapeSuffix from "./store-shape-suffix.mjs";
import storeModeEnum from "./store-mode-enum.mjs";

import composableNaming from "./composable-naming.mjs";

import multilineBlockPadding from "./multiline-block-padding.mjs";

import radashPreferIs from "./radash-prefer-is.mjs";
import radashPreferCall from "./radash-prefer-call.mjs";
import radashPreferClone from "./radash-prefer-clone.mjs";
import radashPreferUnique from "./radash-prefer-unique.mjs";
import radashPreferSum from "./radash-prefer-sum.mjs";
import radashPreferSleep from "./radash-prefer-sleep.mjs";

import vueusePreferStorage from "./vueuse-prefer-storage.mjs";
import vueusePreferMemberCall from "./vueuse-prefer-member-call.mjs";
import vueusePreferTimer from "./vueuse-prefer-timer.mjs";
import vueusePreferObserver from "./vueuse-prefer-observer.mjs";
import vueusePreferClipboard from "./vueuse-prefer-clipboard.mjs";
import vueusePreferRoute from "./vueuse-prefer-route.mjs";

import navigateToObject from "./navigate-to-object.mjs";

export const rules = {
    "template-v-if": templateVIf,
    "template-v-else": templateVElse,
    "template-v-for": templateVFor,
    "template-text": templateText,
    "template-props-prefix": templatePropsPrefix,

    "script-section-order": scriptSectionOrder,
    "script-define-object": scriptDefineObject,
    "script-define-const": scriptDefineConst,

    "store-require-name": storeRequireName,
    "store-require-model": storeRequireModel,
    "store-require-view": storeRequireView,
    "store-require-action": storeRequireAction,

    "store-section-function": storeSectionFunction,
    "store-section-method": storeSectionMethod,
    "store-section-return-shorthand": storeSectionReturnShorthand,

    "store-config-order": storeConfigOrder,
    "store-no-unknown-key": storeNoUnknownKey,

    "store-suffix": storeSuffix,
    "store-name-match": storeNameMatch,
    "store-shape-suffix": storeShapeSuffix,

    "store-mode-enum": storeModeEnum,

    "composable-naming": composableNaming,

    "multiline-block-padding": multilineBlockPadding,

    "radash-prefer-is": radashPreferIs,
    "radash-prefer-call": radashPreferCall,
    "radash-prefer-clone": radashPreferClone,
    "radash-prefer-unique": radashPreferUnique,
    "radash-prefer-sum": radashPreferSum,
    "radash-prefer-sleep": radashPreferSleep,

    "vueuse-prefer-storage": vueusePreferStorage,
    "vueuse-prefer-member-call": vueusePreferMemberCall,
    "vueuse-prefer-timer": vueusePreferTimer,
    "vueuse-prefer-observer": vueusePreferObserver,
    "vueuse-prefer-clipboard": vueusePreferClipboard,
    "vueuse-prefer-route": vueusePreferRoute,

    "navigate-to-object": navigateToObject,
};

for (const [name, rule] of Object.entries(rules)) {
    rule.meta = rule.meta || {};
    rule.meta.docs = { recommended: true, ...rule.meta.docs, url: docsUrl(name) };
}
