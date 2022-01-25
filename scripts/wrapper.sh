#!/bin/sh

./server.sh &

./queue.sh &

./webhook.sh
