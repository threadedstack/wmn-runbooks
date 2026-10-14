---
title: Text processing
image: alpine:3.20
---

# Text processing

Use `grep`, `sed` and `awk` to answer questions about a log. The first block generates a small web-server style log, so the page needs no files of its own.

## Generate a log

```sh {#log}
rm -f /tmp/access.log
i=0
while [ $i -lt 40 ]; do
  case $((i % 7)) in
    0) code=500 ;;
    1|2) code=404 ;;
    *) code=200 ;;
  esac
  path=/page/$((i % 5))
  ms=$(( (i * 37) % 250 + 5 ))
  printf '10.0.0.%d GET %s %d %dms\n' $((i % 4 + 1)) "$path" "$code" "$ms" >> /tmp/access.log
  i=$((i + 1))
done
wc -l /tmp/access.log
head -n 5 /tmp/access.log
```

Each line is: client address, method, path, status code and response time.

## grep: pick lines

```sh {#grep uses=log}
echo "errors (5xx):"
grep -c ' 5[0-9][0-9] ' /tmp/access.log
echo "not found, first three:"
grep ' 404 ' /tmp/access.log | head -n 3
echo "everything except 200:"
grep -vc ' 200 ' /tmp/access.log
```

## sed: rewrite lines

```sh {#sed uses=log}
echo "hide the last octet of the address:"
sed -E 's/^([0-9]+\.[0-9]+\.[0-9]+)\.[0-9]+/\1.x/' /tmp/access.log | head -n 3
echo "only lines 2 to 4:"
sed -n '2,4p' /tmp/access.log
```

## awk: count and add up

```sh {#awk-count uses=log}
echo "requests per status code:"
awk '{ n[$4]++ } END { for (c in n) print c, n[c] }' /tmp/access.log | sort
```

```sh {#awk-time uses=log}
echo "slowest and average response time:"
awk '{ t = $5; sub(/ms/, "", t); t += 0; s += t; if (t > m) m = t }
     END { printf "max %dms, mean %.1fms over %d requests\n", m, s / NR, NR }' /tmp/access.log
```

## Put it together

A pipeline answers "which path has the most errors?":

```sh {#pipeline uses=log}
awk '$4 >= 400 { print $3 }' /tmp/access.log | sort | uniq -c | sort -rn
```

Read it from left to right: keep lines with a status of 400 or more, take the path, group equal paths, count them, put the biggest first.
