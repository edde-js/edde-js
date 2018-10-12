#!/usr/bin/env bash
set -e

npm version patch --no-git-tag-version -f
npm publish --access public
