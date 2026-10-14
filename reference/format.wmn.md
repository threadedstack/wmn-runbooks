---
title: The document format
---

# The document format

A wmn document is a Markdown file. It renders in any Markdown viewer, diffs cleanly in git, and carries just enough extra to say where its code runs. This page describes the parts.

## File names

- `name.wmn.md` is the usual name. To your system and to GitHub it is a Markdown file.
- `name.wmn` is an alias with exactly the same bytes, for systems that open files by their last extension.

wmn reads both the same way and saves a document under the name it has. The published pages on this site come from `.wmn.md` files.

## Front matter

An optional block of YAML at the very start of the file, between two `---` lines. It names the document and the machine its blocks run in.

~~~~markdown
---
title: Getting started
image: python:3.12-slim
---
~~~~

| Key | Meaning |
|---|---|
| `title` | The page title. |
| `image` | The machine image every block runs in, for example `python:3.12-slim` or `alpine:3.20`. Quote a value that looks like a number (`"3.12"`). |
| `cpus` | The number of virtual CPUs for a machine in the browser, from 1 to 16 (a site's engine may offer fewer). |
| `memory` | The machine's memory, in MiB or as a size such as `"1g"`. A machine in the browser has at most 1536 MiB. |
| `network` | `true` or `false`. A machine on a published site has no network, whatever this says. |
| `blocks` | Block packages used by `wmn:use` blocks, pinned by version and hash (see [Blocks](blocks.wmn.md)). |

Give one environment key per document (`image` is the one used on this site). Keys wmn does not know are kept as written. The front matter may not contain a line that is only `---` or `...`.

## Code blocks

A runnable block is an ordinary fenced code block. The first word of the info string is the language; an optional attribute group in braces follows it.

~~~~markdown
```python {#load uses=setup timeout=30s}
print("hello")
```
~~~~

| Attribute | Meaning |
|---|---|
| `#name` | The block's id. Saved outputs, `uses=` and the links on a page refer to blocks by id. Ids are made for you when missing. |
| `uses=a,b` | Ids of blocks (or names of scrubbers and inputs) this block depends on. When one of them runs again, this block is marked out of date, and on a runnable page a scrubber re-runs the blocks that use it. |
| `provides=` | Names this block provides to others. |
| `session=` | The session name. Blocks of the same language and session name share state, such as Python variables. |
| `timeout=` | A run time limit: a number and `s`, `m` or `h` (`30s`, `10m`). |
| `hidden` | Hide the code and show only the output, with a "Show code" button. |
| `collapsed` | Fold the whole block until the reader opens it. |
| `run=manual` / `run=auto` | The run policy. |

Other attributes are kept exactly as written. Class names (`.name`) and `key="quoted value"` forms follow the same grammar. Everything about a fence that you did not change is saved byte for byte.

## Blocks that are not code

Fences whose language starts with `wmn:` are rich blocks: inputs, charts, callouts, tabs, embeds and library blocks. They are plain text in the file (a code block in any other Markdown viewer). [Blocks](blocks.wmn.md) lists them.

## Scrubbers

A number in a sentence that a reader can drag or step with the arrow keys is a code span:

~~~~markdown
The budget is `wmn:M=32 min=4 max=128 step=2 unit=links` per node.
~~~~

`M` is a variable name. A block that reads it says `uses=M`, and the reader's change runs that block again. Keys: `min`, `max`, `step`, `unit`, `label`, and `options` (a comma-separated list the token steps through).

## Saved outputs

A document never holds its outputs. They are kept in a folder beside it, `name.wmn-outputs/`, keyed by block id and a hash of the block's code. A published site shows the saved output of each block as text or an image, and marks an output as out of date when the code has changed since it ran. When a reader presses Run in the browser, the live output replaces the saved one on the page; it is never written back to the site.

The folder holds an `index.json` and a `blobs/` folder of larger outputs named by their SHA-256. Commit it with the document if you want a page to show results before anyone runs it.

## Margin notes

A blockquote placed right after a block, whose first line is the HTML comment `<!--wmn:margin-->`, is a note that belongs to that block. Other Markdown viewers draw it as an ordinary quote under the block.

~~~~markdown
The index builds in one pass.

> <!--wmn:margin-->
> **Why 16**
>
> Smaller values lose recall.
~~~~

## Publishing

`wmn publish FOLDER` turns a folder of documents into a static website, one page per document, with navigation, an outline and optional search. With `--runnable` and an engine folder, blocks get a Run button that starts the machine in the reader's browser; with `--host` it also writes the headers file your host reads. The result is plain files you can serve from any static host.
