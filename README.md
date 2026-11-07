# wmn-runbooks

Runnable operations runbooks written as wmn documents (`.wmn.md`). Shell and Python blocks run in the reader's browser, in a Linux machine compiled to WebAssembly. Nothing is sent to a server.

Source: https://github.com/threadedstack/wmn-runbooks
Site: https://threadedstack.github.io/wmn-runbooks/

## Contents

- `index.wmn.md`: the home page and how to use the site
- `getting-started.wmn.md`: a shell block and two Python blocks that share a variable
- `runbooks/`: inspect a machine, files and permissions, text processing, Python data (with a live chart)
- `reference/`: the document format and the block guide
- `*.wmn-outputs/`: saved outputs shown on a page before anyone presses Run

## Build the site

The site is live at https://runbooks.threadedstack.com (Firebase Hosting, the default site of project `wmn-runbooks`). Every wmn release rebuilds and deploys it on GitHub Actions (`.github/workflows/deploy.yml`, also on a push to `main`), the same way as wmn-claude-code and wmn-doom: the release's Linux wmn binary and engine folder, then `./deploy.sh`.

By hand, with the `wmn` command:

```sh
./build.sh                    # writes ../wmn-runbooks-site (WMN_ENGINE_DIR picks the engine folder, default wmn's own)
./deploy.sh                   # builds for Firebase, deploys, checks the live version, rolls back on failure
```

The built site is not committed to this repository.
