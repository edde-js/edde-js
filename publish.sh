#!/usr/bin/env bash
set -e

git reset --hard
npm version from-git
npm publish --access public
