---
title: Getting started
image: python:3.12-slim
---

# Getting started

This page runs in a Debian-based Linux machine with Python 3.12. Press **Run** on each block below, top to bottom.

## A shell block

Ask the machine what it is.

```sh {#whoami}
uname -a
echo
cat /etc/os-release
```

The output appears under the block. The kernel line is the Linux kernel running inside WebAssembly, and `os-release` describes the image the page asked for.

## A Python block

```python {#first}
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
total = sum(numbers)
print("numbers:", numbers)
print("total:", total)
```

## A second Python block that reuses the first

Blocks of one language on a page share a session, so the variables from the block above are still defined.

```python {#second uses=first}
print("largest:", max(numbers))
print("mean:", total / len(numbers))
```

If you run this block before the one above it, Python reports that `numbers` is not defined. Run the first block, then try again.

## What next

- Look around the machine with [Inspect a machine](runbooks/inspect-a-machine.wmn.md).
- Learn how these pages are written in [The document format](reference/format.wmn.md).
