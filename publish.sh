#!/usr/bin/env bash
set -e

npm version minor --from-git
npm publish --access public
