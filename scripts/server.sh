#!/bin/sh
(cd /usr/app && yarn typeorm-run)
(cd /usr/app && yarn seed:run)
(cd /usr/app && yarn start:server)
