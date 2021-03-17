#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR
./node_modules/.bin/devcert generate localhost &&
(
  cp localhost.cert client/snowpack.crt
  cp localhost.key client/snowpack.key

  cp localhost.cert server/keys/
  cp localhost.key server/keys/

  rm localhost.cert localhost.key
)