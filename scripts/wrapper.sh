#!/bin/sh
(cd /home/node/app && ./server.sh) &
(cd /home/node/app && ./queue.sh) &
(cd /home/node/app && ./webhook.sh)
