---
title: Files and permissions
image: alpine:3.20
---

# Files and permissions

Create files, change who can do what with them, find them again and read them back. Every block uses full paths, so you can run any block on its own, but the later blocks expect the files made by the first one.

## Make a small tree

```sh {#make}
rm -rf /tmp/demo
mkdir -p /tmp/demo/notes /tmp/demo/bin
printf 'hello from wmn\n' > /tmp/demo/hello.txt
printf 'one\ntwo\nthree\n' > /tmp/demo/notes/list.txt
printf '#!/bin/sh\necho "the script ran"\n' > /tmp/demo/bin/run.sh
ls -lR /tmp/demo
```

New files are not executable. Look at the first column of `ls -l`: the letters are read, write and execute for the owner, the group and everyone else.

## Read a file

```sh {#read uses=make}
cat /tmp/demo/hello.txt
echo "--- a longer one"
cat /tmp/demo/notes/list.txt
echo "--- a system file"
cat /etc/os-release
```

## Change modes

```sh {#chmod uses=make}
/tmp/demo/bin/run.sh || echo "not allowed yet (exit $?)"
chmod u+x /tmp/demo/bin/run.sh
/tmp/demo/bin/run.sh
chmod 600 /tmp/demo/hello.txt
chmod 755 /tmp/demo/notes
stat -c '%a %A %n' /tmp/demo/hello.txt /tmp/demo/notes /tmp/demo/bin/run.sh
```

A mode can be symbolic (`u+x`: add execute for the owner) or octal (`600`: read and write for the owner only). In octal each digit adds read (4), write (2) and execute (1) for owner, group and others.

## Find files

```sh {#find uses=make}
echo "text files:"
find /tmp/demo -type f -name '*.txt'
echo "executable files:"
find /tmp/demo -type f -perm -u+x
echo "directories:"
find /tmp/demo -type d
```

## Count and compare

```sh {#count uses=make}
wc -l /tmp/demo/notes/list.txt
du -sk /tmp/demo
cp /tmp/demo/notes/list.txt /tmp/demo/notes/copy.txt
cmp /tmp/demo/notes/list.txt /tmp/demo/notes/copy.txt && echo "identical"
```

## Clean up

```sh {#cleanup}
rm -rf /tmp/demo
ls /tmp
```
