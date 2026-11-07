#!/usr/bin/env bash
# Deploys the runbooks site to Firebase Hosting: the default site of project wmn-runbooks (https://wmn-runbooks.web.app).
# The same steps as wmn-claude-code/deploy.sh and wmn-doom/deploy.sh:
#   1. build once with the host's header file (firebase.json), aimed at this site only;
#   2. stamp the build with wmn-runbooks-version.json (this repo's commit);
#   3. copy the live site to the "previous" channel, deploy, and check the site serves the new version;
#   4. on a failed deploy or check, put "previous" back live.
# Needs the logged-in firebase CLI (or GOOGLE_APPLICATION_CREDENTIALS), wmn (or WMN_BIN) and python3.
#   ./deploy.sh [site dir]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/../wmn-runbooks-site}"
project=wmn-runbooks
site=wmn-runbooks
url="https://$site.web.app"
version="$(git -C "$here" rev-parse HEAD)"
wmn="${WMN_BIN:-$(command -v wmn || true)}"
[ -n "$wmn" ] || { echo "deploy.sh: no wmn on PATH; set WMN_BIN to the wmn binary" >&2; exit 1; }
[ -z "$(git -C "$here" status --porcelain --untracked-files=no)" ] || { echo "deploy.sh: commit your changes first (the site is stamped with the commit)" >&2; exit 1; }

rm -rf "$out"
"$wmn" publish "$here" --out "$out" --runnable --host firebase --base / ${WMN_ENGINE_DIR:+--engine "$WMN_ENGINE_DIR"}
python3 - "$out/firebase.json" "$site" <<'PYEOF'
import json, sys
p, site = sys.argv[1], sys.argv[2]
j = json.load(open(p))
h = j["hosting"]
for c in (h if isinstance(h, list) else [h]):
    c["site"] = site
json.dump(j, open(p, "w"), indent=2)
PYEOF
printf '{"version":"%s"}\n' "$version" > "$out/wmn-runbooks-version.json"

rollback() {
  echo "deploy.sh: $1; restoring the previous deploy" >&2
  [ "$had_live" = 1 ] && firebase hosting:clone "$site:previous" "$site:live" --project "$project"
  exit 1
}
had_live=0
if firebase hosting:clone "$site:live" "$site:previous" --project "$project"; then had_live=1; fi
(cd "$out" && firebase deploy --only "hosting:$site" --project "$project") || rollback "the deploy failed"
for i in $(seq 1 12); do
  seen="$(curl -fsS -H 'Cache-Control: no-cache' "$url/wmn-runbooks-version.json?t=$(date +%s)" 2>/dev/null || true)"
  case "$seen" in *"$version"*) echo "live: $url serves $version"; exit 0;; esac
  sleep 5
done
rollback "$url does not serve version $version (it answers: ${seen:-nothing})"
