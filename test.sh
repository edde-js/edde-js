#!/usr/bin/env bash
set -e

npm install >/dev/null 2>&1
npm run pretest
node_modules/.bin/nyc --reporter=text-summary node_modules/.bin/ava
