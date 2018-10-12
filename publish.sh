#!/usr/bin/env bash
set -e

git reset --hard
npm --no-git-tag-version version from-git
npm --no-git-tag-version publish --access public
