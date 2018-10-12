#!/usr/bin/env bash
set -e

git reset --hard
npm version from-git --no-git-tag-version
npm publish --access public
