// All custom rules, keyed by their kebab-case name (one rule per file). The key
// is the name a config references as @diphyx/<key>, and it also drives the rule's
// generated docs URL, so the two never drift.

import { docsUrl } from "../utils/docs.mjs";

import templateVIf from "./template-v-if.mjs";
import templateVElse from "./template-v-else.mjs";
import templateVFor from "./template-v-for.mjs";
import templateText from "./template-text.mjs";

import scriptSectionOrder from "./script-section-order.mjs";
import scriptDefineObject from "./script-define-object.mjs";

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

export const rules = {
    // Template
    "template-v-if": templateVIf,
    "template-v-else": templateVElse,
    "template-v-for": templateVFor,
    "template-text": templateText,

    // Script
    "script-section-order": scriptSectionOrder,
    "script-define-object": scriptDefineObject,

    // Store — required keys
    "store-require-name": storeRequireName,
    "store-require-model": storeRequireModel,
    "store-require-view": storeRequireView,
    "store-require-action": storeRequireAction,

    // Store — section shape
    "store-section-function": storeSectionFunction,
    "store-section-method": storeSectionMethod,
    "store-section-return-shorthand": storeSectionReturnShorthand,

    // Store — config integrity
    "store-config-order": storeConfigOrder,
    "store-no-unknown-key": storeNoUnknownKey,

    // Store — naming
    "store-suffix": storeSuffix,
    "store-name-match": storeNameMatch,
    "store-shape-suffix": storeShapeSuffix,

    // Store — values
    "store-mode-enum": storeModeEnum,

    // Composable
    "composable-naming": composableNaming,

    // Layout
    "multiline-block-padding": multilineBlockPadding,

    // Radash
    "radash-prefer-is": radashPreferIs,
    "radash-prefer-call": radashPreferCall,
    "radash-prefer-clone": radashPreferClone,
    "radash-prefer-unique": radashPreferUnique,
    "radash-prefer-sum": radashPreferSum,
    "radash-prefer-sleep": radashPreferSleep,

    // VueUse
    "vueuse-prefer-storage": vueusePreferStorage,
    "vueuse-prefer-member-call": vueusePreferMemberCall,
    "vueuse-prefer-timer": vueusePreferTimer,
    "vueuse-prefer-observer": vueusePreferObserver,
    "vueuse-prefer-clipboard": vueusePreferClipboard,
    "vueuse-prefer-route": vueusePreferRoute,
};

// Backfill each rule's docs metadata from its registered name so every rule
// exposes a valid `meta.docs.url` and `recommended` flag without repeating the
// name in the rule file itself.
for (const [name, rule] of Object.entries(rules)) {
    rule.meta = rule.meta || {};
    rule.meta.docs = { recommended: true, ...rule.meta.docs, url: docsUrl(name) };
}
