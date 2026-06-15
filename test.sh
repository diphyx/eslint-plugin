#!/bin/sh
# Deterministic pass/fail test for the rule harness under app/.
#
# ESLint exits 0 on warnings, and every rule here is "warn" severity, so neither
# `lint` nor `lint:warnings` can actually fail when something regresses. This
# script turns the harness into a real test:
#
#   1. valid   — the repo + app/**/valid/** must produce ZERO problems.
#   2. invalid — every rule the preset configures must fire at least once on
#                app/**/invalid/**, and no fixture may have a parse error.
#
# Run with `pnpm test` (or `sh test.sh`). Exits non-zero on any failure.

set -u

status=0

# --- 1. valid: nothing may warn ---
if pnpm exec eslint . --max-warnings 0 >/tmp/harness-valid.log 2>&1; then
    echo "✓ valid: 0 problems across the repo"
else
    echo "✗ valid fixtures produced problems:"
    cat /tmp/harness-valid.log
    status=1
fi

# --- 2. invalid: every expected rule must fire, with no parse errors ---
report=$(pnpm exec eslint -c eslint.warnings.mjs \
    "app/**/invalid/**/*.ts" "app/**/invalid/**/*.vue" -f json 2>/dev/null)

if printf '%s' "$report" | grep -q '"fatal":true'; then
    echo "✗ invalid fixtures have parse errors:"
    printf '%s' "$report" | grep -oE '"message":"[^"]+"' | sed 's/"message":"/    /; s/"$//'
    status=1
fi

# Expected rules: the plugin's own rules (authoritative) + the third-party
# rules the preset configures.
expected=$(
    node -e "import('./src/index.mjs').then((m) => console.log(Object.keys(m.default.rules).map((r) => '@diphyx/' + r).join('\n')))"
    printf '%s\n' \
        arrow-body-style \
        @typescript-eslint/naming-convention \
        vue/block-lang \
        vue/component-api-style \
        vue/attributes-order \
        check-file/filename-naming-convention
)
expected=$(printf '%s\n' "$expected" | sort -u)

fired=$(printf '%s' "$report" | grep -oE '"ruleId":"[^"]+"' | sed 's/"ruleId":"//; s/"$//' | sort -u)

missing=""
for rule in $expected; do
    if ! printf '%s\n' "$fired" | grep -qx "$rule"; then
        missing="$missing $rule"
    fi
done

total=$(printf '%s\n' "$expected" | grep -c .)

if [ -n "$missing" ]; then
    echo "✗ expected rule(s) that never fired:"
    for rule in $missing; do
        echo "    $rule"
    done
    status=1
else
    echo "✓ invalid: all $total expected rules fired"
fi

echo
if [ "$status" -ne 0 ]; then
    echo "harness test FAILED"
    exit 1
fi
echo "harness test passed"
