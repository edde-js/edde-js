#!/usr/bin/env bash
set -e

git reset --hard
npm --no-git-tag-version version from-git
npm publish --access public
