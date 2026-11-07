#!/usr/bin/env bash
# Builds the runnable runbooks site.
#   ./build.sh [OUT]          (default OUT: ../wmn-runbooks-site)
# Uses `wmn` from PATH, or the binary WMN_BIN names. WMN_ENGINE_DIR picks the engine folder (default: wmn's own).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/../wmn-runbooks-site}"
wmn="${WMN_BIN:-$(command -v wmn || true)}"
[ -n "$wmn" ] || { echo "build.sh: no wmn on PATH; set WMN_BIN to the wmn binary" >&2; exit 1; }
rm -rf "$out"
# extra arguments go to wmn publish (deploy.sh passes --host firebase --base /)
"$wmn" publish "$here" --out "$out" --runnable ${WMN_ENGINE_DIR:+--engine "$WMN_ENGINE_DIR"} "${@:2}"
echo "built $out"
