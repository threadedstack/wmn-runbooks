---
title: wmn runbooks
---

# wmn runbooks

A small site of runnable documentation. Every shell and Python block on these pages has a **Run** button. Press it and the block runs **in your own browser**, inside a small Linux machine that was compiled to WebAssembly. Nothing you run is sent to a server, and the machine has no network.

The pages are wmn documents (`.wmn.md`): ordinary Markdown with a few extra attributes on code fences, so the same files also read fine in any Markdown viewer.

## Start here

- [Getting started](getting-started.wmn.md): run a shell block and two Python blocks that share a variable.

## Runbooks

Practical operations tasks, each one runnable inside the guest Linux.

- [Inspect a machine](runbooks/inspect-a-machine.wmn.md): CPU, memory, disks, mounts and processes.
- [Files and permissions](runbooks/files-and-permissions.wmn.md): create files, change modes, find and read them.
- [Text processing](runbooks/text-processing.wmn.md): grep, sed and awk on a generated log.
- [Python data](runbooks/python-data.wmn.md): make a small dataset, summarize it, and draw a live chart that follows a scrubber.

## Reference

- [The document format](reference/format.wmn.md)
- [Blocks](reference/blocks.wmn.md)

## How to use the site

1. Read a page. The code and the output saved with it are shown as they were when the page was built.
2. Press **Run** on a block. The first Run on a page downloads and starts the machine, which takes a little while (the site may include a saved snapshot of the machine so that start is faster). Later Runs reuse the same machine.
3. Blocks on one page share that machine, so files you create and Python variables you set are still there for the next block. Run blocks in order.
4. Some pages have a draggable number (a scrubber) or a chart. Moving the number runs the blocks that use it again, and the chart redraws from the new result.
5. Use the search box in the header to find a page.

## Browser notes

The machine needs a modern browser with WebAssembly and shared memory, and a page that is served in a way that allows it (the site handles this for you on the common hosts).

- **Chromium** (Chrome, Edge, Brave and others) and **Firefox** both work.
- **WebKit** (Safari) works too.
- Starting is a little faster in Chromium and WebKit when the site ships a snapshot; Firefox starts the machine from scratch.
- The machine uses a few hundred megabytes of memory while a page is open. Close the tab to stop it.
- With JavaScript turned off the pages still read, but blocks do not run.
- The machine has one virtual CPU and no network, so commands that need the internet fail by design.

## Source

The source of this site is at github.com/threadedstack/wmn-runbooks.
