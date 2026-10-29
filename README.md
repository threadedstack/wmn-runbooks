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

With the `wmn` command and an engine folder (the machine images and the WebAssembly engine):

```
wmn publish . --out ../site --runnable --engine ENGINE_DIR \
  --host github-pages --base /wmn-runbooks/ --search
wmn publish --check ../site --host github-pages --base /wmn-runbooks/
```

For Netlify use `--host netlify --base /`. Every runnable publish carries the machines' base snapshots. `--search` needs Pagefind (`pagefind_extended` on PATH, or `WMN_PAGEFIND`). The built site is not committed to this repository.
