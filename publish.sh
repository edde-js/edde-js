#!/usr/bin/env bash
set -e

npm version from-git --no-git-tag-version -f
npm publish --access public
