#!/usr/bin/env bash
set -e

npm test
npm version patch --no-git-tag-version -f
npm publish --access public
