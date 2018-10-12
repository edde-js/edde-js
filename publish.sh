#!/usr/bin/env bash
set -e

git reset --hard
npm version from-git --tags
npm publish --access public
