#!/usr/bin/env bash
set -e

git reset --hard
npm version --tags from-git
npm publish --access public
