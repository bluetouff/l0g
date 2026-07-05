#!/usr/bin/env bash

set -euo pipefail

MCP_URL="${L0G_MCP_URL:-https://l0g.fr/api/mcp}"
PAYLOAD='{"jsonrpc":"2.0","id":1,"method":"ping","params":{}}'

tmp_body="$(mktemp)"
cleanup() {
  rm -f "$tmp_body"
}
trap cleanup EXIT

run_case() {
  local name="$1"
  local expected_status="$2"
  local expected_body_fragment="$3"
  shift 3

  local status
  status=$(curl -sS -o "$tmp_body" -w "%{http_code}" "$@")
  local body
  body="$(cat "$tmp_body")"

  if [[ "$status" != "$expected_status" ]]; then
    echo "FAIL [$name] - status: $status (expected $expected_status)"
    echo "body: $body"
    exit 1
  fi

  if [[ -n "$expected_body_fragment" ]] && ! grep -Fq "$expected_body_fragment" "$tmp_body"; then
    echo "FAIL [$name] - missing expected body fragment: $expected_body_fragment"
    echo "body: $body"
    exit 1
  fi

  echo "PASS [$name] - status: $status"
}

echo "MCP smoke test for $MCP_URL"
echo

run_case \
  "missing Accept header" \
  "406" \
  "Not Acceptable" \
  -X POST \
  "$MCP_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

run_case \
  "missing Content-Type header" \
  "415" \
  "unsupported content type" \
  -X POST \
  "$MCP_URL" \
  -H "Accept: application/json, text/event-stream" \
  -d "$PAYLOAD"

run_case \
  "valid headers" \
  "200" \
  "\"result\":{}" \
  -X POST \
  "$MCP_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d "$PAYLOAD"

echo
echo "All MCP smoke tests passed."
