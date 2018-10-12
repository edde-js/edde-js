#!/usr/bin/env bash
set -e

git reset --hard
npm version --no-git-tag-version from-git
npm publish --access public
