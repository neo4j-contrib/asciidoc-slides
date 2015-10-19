#!/bin/sh

# automatically rebuild html from adoc upon file changes
# N.B. this script requires Linux' inotifywait 
# on Debian/Ubuntu: apt-get install inotify-tools
#
# Usage:
# ./autorecompile.sh content/training/intro/classroom-enterprise/index.adoc
#
# Known limitations:
# * unable to pass additional parameter (like it's possible for run.sh)

DIR=`dirname $1`
echo "watching $DIR"
while inotifywait -e modify $DIR; do
	./run.sh "$@"
done
