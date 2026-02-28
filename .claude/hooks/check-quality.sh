#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0

# 既にStop hookによる再実行中なら停止を許可（無限ループ防止）
stop_hook_active=$(echo "$CLAUDE_HOOK_INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)
if [ "$stop_hook_active" = "true" ]; then
  exit 0
fi

errors=""

lint_output=$(npm run lint 2>&1)
lint_exit=$?
if [ $lint_exit -ne 0 ]; then
  errors+="=== npm run lint failed ===\n$lint_output\n\n"
fi

typecheck_output=$(npm run type-check 2>&1)
typecheck_exit=$?
if [ $typecheck_exit -ne 0 ]; then
  errors+="=== npm run type-check failed ===\n$typecheck_output\n\n"
fi

if [ -n "$errors" ]; then
  echo -e "$errors" >&2
  echo "上記のエラーを修正してください。" >&2
  exit 2
fi
