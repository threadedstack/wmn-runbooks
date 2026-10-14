---
title: Python data
image: python:3.12-slim
blocks:
  charts:
    from: stdlib/charts
    version: "1.0.0"
    sha256: 625e7d34b5318e53aa3782ae13e456f0a62a7022b5a8f3dec121a7854ec8511a
---

# Python data

Make a small dataset with only the Python standard library, summarize it, and then draw a chart that follows a number you can move. Run the blocks from the top.

## Generate a dataset

A week of made-up request counts for three services, from a fixed seed so everyone sees the same numbers.

```python {#dataset}
import random

rng = random.Random(7)
services = ["api", "web", "worker"]
rows = []
for day in range(1, 8):
    for name in services:
        base = {"api": 120, "web": 200, "worker": 60}[name]
        rows.append((day, name, base + rng.randint(-25, 25)))

print(len(rows), "rows")
for row in rows[:6]:
    print(row)
```

## Summarize it

```python {#summary uses=dataset}
import statistics

for name in services:
    counts = [n for (_, s, n) in rows if s == name]
    print(f"{name:7} min {min(counts):4}  max {max(counts):4}  "
          f"mean {statistics.mean(counts):7.2f}  stdev {statistics.stdev(counts):6.2f}")

busiest = max(rows, key=lambda r: r[2])
print("busiest:", busiest)
```

```python {#totals uses=dataset}
from collections import defaultdict

by_day = defaultdict(int)
for day, _, n in rows:
    by_day[day] += n
for day in sorted(by_day):
    bar = "#" * (by_day[day] // 20)
    print(f"day {day}: {by_day[day]:4} {bar}")
```

## A live chart

The number `wmn:amplitude=1 min=1 max=4 step=1` scales a daily temperature swing. Drag it or use the arrow keys when it has focus. The block below prints a table, and the chart under it draws that table again after every Run.

```python {#temperature uses=amplitude}
import math

rows_t = [
    [hour, round(18 + 5 * float(amplitude) * math.sin((hour - 9) / 24 * 2 * math.pi), 2)]
    for hour in range(0, 25, 2)
]
display({"application/vnd.wmn.table+json": {"columns": ["hour", "temperature"], "rows": rows_t}}, raw=True)
print(len(rows_t), "readings, amplitude", amplitude)
```

```wmn:use {#temperature-chart lib=charts block=line-chart}
source: temperature
x: hour
y: temperature
title: Temperature by hour
```

The chart is drawn from the table saved with the page when you open it. After a Run it is drawn from what the machine printed, and **Reset** under the chart goes back to the saved table.

## Counts as a histogram

```python {#latencies uses=dataset}
rng2 = random.Random(3)
values = [round(rng2.lognormvariate(3.2, 0.5), 1) for _ in range(200)]
display({"application/vnd.wmn.table+json": {"columns": ["ms"], "rows": [[v] for v in values]}}, raw=True)
print("200 samples, median", sorted(values)[100])
```

```wmn:use {#latency-histogram lib=charts block=histogram}
source: latencies
column: ms
bins: 12
title: Response time
```
