#!/usr/bin/env bash
set -e

npm install
npm run pretest
node_modules/.bin/nyc --reporter=text-summary node_modules/.bin/ava
