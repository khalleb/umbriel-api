#!/bin/sh
(cd /home/node/app && yarn prod:migration)
(cd /home/node/app && yarn start:server)
