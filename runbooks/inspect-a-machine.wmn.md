---
title: Inspect a machine
image: alpine:3.20
---

# Inspect a machine

A runbook for answering "what is this box?" with only the tools in a minimal Alpine Linux image (BusyBox). The machine here is the page's own virtual machine, so the numbers describe it, not your computer.

## Who and where

```sh {#identity}
echo "user: $(id -un) (uid $(id -u))"
echo "host: $(hostname)"
uname -srm
cat /etc/alpine-release
```

## CPU

The machine has one virtual CPU.

```sh {#cpu}
grep -c '^processor' /proc/cpuinfo
head -n 12 /proc/cpuinfo
```

## Memory

```sh {#memory}
head -n 5 /proc/meminfo
echo
free -m
```

`MemAvailable` is the number to watch. `MemFree` ignores memory the kernel can take back from caches.

## Disks and mounts

```sh {#disk}
df -h
```

```sh {#mounts}
mount | head -n 20
```

Look for the root file system and for `tmpfs` mounts such as `/tmp` and `/dev/shm`. The kernel's own view is in `/proc/mounts`.

## Processes

```sh {#procs}
ps
echo
uptime
```

## Load and uptime in the raw

```sh {#raw}
cat /proc/loadavg
cat /proc/uptime
```

The three load numbers are the 1, 5 and 15 minute averages, then running and total tasks, then the last process id. The two uptime numbers are seconds up and seconds idle.

## Checklist

1. Identify the system (`uname`, `/etc/*-release`).
2. Count CPUs and read `MemAvailable`.
3. Check free space with `df -h` before you write anything big.
4. Read `mount` for read-only or unexpected mounts.
5. List processes and the load average.
