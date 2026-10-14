---
title: Blocks
---

# Blocks

Besides code, a wmn document can hold a small set of rich blocks. Each is a fenced block whose language starts with `wmn:`, so it stays readable as text in any Markdown viewer. The body is usually `key: value` lines, one per line.

## Code

A fenced block with a language and optional attributes, as described in [The document format](format.wmn.md). On a runnable page a block the machine can run gets a **Run** button; the first Run on a page starts the machine, and later Runs reuse it.

## Input

A control whose value the blocks that use it can read.

~~~~markdown
```wmn:input {#count}
name: count
type: slider
min: 0
max: 100
value: 42
```
~~~~

`type` is one of `text`, `number`, `slider`, `select`, `date` or `file`. Other keys are `label`, `step`, `options` and `accept`. A code block reads the value with `uses=count`, as the variable `count`.

## Chart

A chart of a table that a code block produced.

~~~~markdown
```wmn:chart {#sales-chart}
source: sales
type: bar
x: month
y: total
title: Sales by month
```
~~~~

`source` is the id of the block whose output is a table.

## Callout

A note that stands out. The body is Markdown and `kind=` is `note`, `tip`, `important`, `warning` or `caution`.

~~~~markdown
```wmn:callout {kind=warning}
This **overwrites** the table.
```
~~~~

## Tabs

Show one of several blocks at a time. Each entry names a block by id; the blocks follow the tabs block in the document.

~~~~markdown
```wmn:tabs
- { label: SQL, block: create-table }
- { label: Python, block: load }
```
~~~~

## Embed

A web page inside the document, with `src=` and `height=` attributes. Some tools show it as plain code rather than drawing the page.

## Library blocks

A `wmn:use` block draws with a view from a block package. The front matter pins the package, and the block names it and the block to use:

~~~~markdown
---
blocks:
  charts:
    from: stdlib/charts
    version: "1.0.0"
    sha256: <the package hash>
---

```wmn:use {#trend lib=charts block=line-chart}
source: temperature
x: hour
y: temperature
```
~~~~

- `lib=` is the name pinned under `blocks:`, and `block=` is a block of that package.
- `source:` names the block (or blocks, comma separated) that prints the table the view draws. `uses=` can name more.
- The other lines are the view's parameters. A view cannot change `source` or the pin.
- A package and its views are plain files. The view runs in a sandboxed frame that cannot read the page, use storage, or reach the network. It is sent only its parameters, the theme and the tables it was fed from.

### Feeding a view

The block named by `source:` prints a table, which a Python block can do with:

~~~~markdown
```python {#temperature}
display({"application/vnd.wmn.table+json": {"columns": ["hour", "temperature"], "rows": [[0, 18.0], [2, 17.4]]}}, raw=True)
```
~~~~

The page draws the view from the table saved with the page. After you press Run the view redraws from the table the machine printed.

### The bundled packages

| Package | Blocks |
|---|---|
| `stdlib/charts` | **Line chart** (`line-chart`), **Bar chart** (`bar-chart`), **Scatter plot** (`scatter-plot`), **Histogram and CDF** (`histogram`). Parameters include `x`, `y`, `title` (and `column`, `bins` for the histogram). |
| `stdlib/explore` | **Metric table** (`metric-table`: totals for each column, with the changes between runs highlighted), **Network graph** (`network-graph`: a table of pairs drawn as nodes and edges), and the scrubbable number. |
| `stdlib/data` | Templates for loading a file and for an SQL query. |
| `stdlib/core` | The input, chart, callout, tabs, embed and code blocks above. |

## Scrubbers

A number inside a sentence that you can drag. See [The document format](format.wmn.md#scrubbers). Moving a scrubber re-runs the blocks that name it in `uses=`, and a live view fed from them redraws.
